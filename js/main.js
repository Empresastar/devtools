window.onload = () => {
    const peer = new Peer();
    let conn;
    let editor;
    let isLocalChange = true;

    // 1. Inicia o Motor do VS Code
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        editor = monaco.editor.create(document.getElementById('editor-container'), {
            value: "// 1. Clique em 'Abrir Pasta'\n// 2. Mande seu ID para o amigo\n// 3. Programem juntos!",
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true
        });

        editor.onDidChangeModelContent(() => {
            if (isLocalChange && conn && conn.open) {
                conn.send({ type: 'EDIT', content: editor.getValue() });
            }
        });
    });

    // 2. Abrir pasta do Computador (Igual VS Code)
    document.getElementById('btn-abrir-pasta').onclick = async () => {
        try {
            const dirHandle = await window.showDirectoryPicker();
            const listaUI = document.getElementById('lista-arquivos');
            listaUI.innerHTML = "";
            let nomesArquivos = [];

            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file') {
                    nomesArquivos.push(entry.name);
                    const li = document.createElement('li');
                    li.innerText = "📄 " + entry.name;
                    li.onclick = async () => {
                        const file = await entry.getFile();
                        const text = await file.text();
                        isLocalChange = false;
                        editor.setValue(text);
                        isLocalChange = true;
                        if (conn) conn.send({ type: 'OPEN', name: entry.name, content: text });
                    };
                    listaUI.appendChild(li);
                }
            }
            if (conn) conn.send({ type: 'LIST', files: nomesArquivos });
        } catch (e) { console.log("Pasta não selecionada"); }
    };

    // 3. Conexão P2P
    peer.on('open', id => document.getElementById('meu-id').innerText = id);
    peer.on('connection', c => { 
        conn = c; 
        document.getElementById('status').innerText = "Status: Amigo Conectado!";
        setupSinc(); 
    });

    document.getElementById('btn-conectar').onclick = () => {
        const id = document.getElementById('id-amigo-input').value;
        conn = peer.connect(id);
        setupSinc();
    };

    function setupSinc() {
        conn.on('data', (data) => {
            isLocalChange = false;
            if (data.type === 'EDIT' || data.type === 'OPEN') {
                editor.setValue(data.content);
                if(data.name) document.getElementById('status').innerText = "Editando: " + data.name;
            }
            if (data.type === 'LIST') {
                const listaUI = document.getElementById('lista-arquivos');
                listaUI.innerHTML = data.files.map(f => `<li>📄 ${f}</li>`).join('');
            }
            isLocalChange = true;
        });
        conn.on('open', () => document.getElementById('status').innerText = "Status: Sincronizado!");
    }
};
