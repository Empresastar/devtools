window.onload = () => {
    const peer = new Peer();
    let conn;
    let editor;
    let isLocalChange = true;

    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        // Criando o editor com syntax highlighting
        editor = monaco.editor.create(document.getElementById('editor-container'), {
            value: "// Rubi Code aberto. Selecione um arquivo.",
            language: 'javascript', 
            theme: 'vs-dark',
            automaticLayout: true,
            fontSize: 14,
            fontFamily: 'Consolas, monospace'
        });

        // Envia as edições via P2P
        editor.onDidChangeModelContent(() => {
            if (isLocalChange && conn && conn.open) {
                conn.send({ type: 'EDIT', content: editor.getValue() });
            }
        });
    });

    // Abrir pasta real e listar arquivos
    document.getElementById('btn-abrir-pasta').onclick = async () => {
        const dirHandle = await window.showDirectoryPicker();
        const lista = document.getElementById('lista-arquivos');
        lista.innerHTML = "";

        for await (const entry of dirHandle.values()) {
            if (entry.kind === 'file') {
                const li = document.createElement('li');
                li.innerText = "📄 " + entry.name;
                li.onclick = async () => {
                    const file = await entry.getFile();
                    const text = await file.text();
                    
                    // Detecta linguagem pelo nome do arquivo (ex: .html)
                    const ext = entry.name.split('.').pop();
                    let lang = 'javascript';
                    if(ext === 'html') lang = 'html';
                    if(ext === 'css') lang = 'css';

                    isLocalChange = false;
                    monaco.editor.setModelLanguage(editor.getModel(), lang);
                    editor.setValue(text);
                    document.getElementById('tab-name').innerText = entry.name;
                    isLocalChange = true;

                    if (conn) conn.send({ type: 'OPEN', name: entry.name, content: text, lang: lang });
                };
                lista.appendChild(li);
            }
        }
    };

    // PeerJS (P2P)
    peer.on('open', id => document.getElementById('meu-id').innerText = id);
    peer.on('connection', c => { conn = c; setupSinc(); });
    document.getElementById('btn-conectar').onclick = () => {
        conn = peer.connect(document.getElementById('id-amigo-input').value);
        setupSinc();
    };

    function setupSinc() {
        conn.on('data', (data) => {
            isLocalChange = false;
            if (data.type === 'EDIT' || data.type === 'OPEN') {
                if(data.lang) monaco.editor.setModelLanguage(editor.getModel(), data.lang);
                editor.setValue(data.content);
                if(data.name) document.getElementById('tab-name').innerText = data.name;
            }
            isLocalChange = true;
        });
    }
};
