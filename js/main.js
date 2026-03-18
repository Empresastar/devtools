window.onload = () => {
    const peer = new Peer();
    let conn;
    let editor;
    let isLocalChange = true;
    let arquivosDaPasta = [];

    // 1. Iniciar Monaco Editor
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        editor = monaco.editor.create(document.getElementById('editor-container'), {
            value: "// Selecione um arquivo na lateral para editar",
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

    // 2. FUNÇÃO MÁGICA: Abrir pasta do computador
    document.getElementById('btn-abrir-pasta').onclick = async () => {
        try {
            // Abre o seletor de pastas do Windows/Mac
            const directoryHandle = await window.showDirectoryPicker();
            const listaUI = document.getElementById('lista-arquivos');
            listaUI.innerHTML = ""; 
            arquivosDaPasta = [];

            for await (const entry of directoryHandle.values()) {
                if (entry.kind === 'file') {
                    arquivosDaPasta.push(entry.name);
                    const li = document.createElement('li');
                    li.innerText = "📄 " + entry.name;
                    li.onclick = () => carregarArquivo(entry);
                    listaUI.appendChild(li);
                }
            }

            // Envia a lista de arquivos para o amigo ver também
            if (conn && conn.open) {
                conn.send({ type: 'FILES', list: arquivosDaPasta });
            }
        } catch (err) {
            console.error("Usuário cancelou ou erro:", err);
        }
    };

    async function carregarArquivo(fileHandle) {
        const file = await fileHandle.getFile();
        const content = await file.text();
        isLocalChange = false;
        editor.setValue(content);
        isLocalChange = true;
        
        // Avisa o amigo para mudar o arquivo dele também
        if (conn && conn.open) {
            conn.send({ type: 'OPEN_FILE', fileName: fileHandle.name, content: content });
        }
    }

    // 3. Conexão P2P
    peer.on('open', id => document.getElementById('meu-id').innerText = id);

    peer.on('connection', c => {
        conn = c;
        document.getElementById('status').innerText = "Conectado!";
        setupReceiver();
    });

    document.getElementById('btn-conectar').onclick = () => {
        const id = document.getElementById('id-amigo-input').value;
        conn = peer.connect(id);
        setupReceiver();
    };

    function setupReceiver() {
        conn.on('data', (data) => {
            if (data.type === 'EDIT') {
                isLocalChange = false;
                editor.setValue(data.content);
                isLocalChange = true;
            } 
            if (data.type === 'FILES') {
                // O amigo vê a lista de arquivos que você abriu
                const listaUI = document.getElementById('lista-arquivos');
                listaUI.innerHTML = data.list.map(f => `<li>📄 ${f}</li>`).join('');
            }
            if (data.type === 'OPEN_FILE') {
                isLocalChange = false;
                editor.setValue(data.content);
                isLocalChange = true;
                alert("O Host abriu o arquivo: " + data.fileName);
            }
        });
    }
};
