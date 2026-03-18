window.onload = () => {
    const peer = new Peer(); 
    let conn;
    let editor;
    let isLocalChange = true;

    // Inicializa o Monaco Editor (Motor do VS Code)
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        const container = document.getElementById('editor-container');
        
        editor = monaco.editor.create(container, {
            value: "// 💎 Rubi Code P2P\n// Digite algo e compartilhe seu ID!",
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true,
            fontSize: 16,
            minimap: { enabled: false }
        });

        // Evento: Quando você digita, envia para o amigo conectado
        editor.onDidChangeModelContent(() => {
            if (isLocalChange && conn && conn.open) {
                conn.send(editor.getValue());
            }
        });
    });

    // Mostra seu ID na barra lateral
    peer.on('open', (id) => {
        document.getElementById('meu-id').innerText = id;
        document.getElementById('status').innerText = "Status: Online (Pronto)";
    });

    // Escuta quando alguém tenta entrar no seu código (Você é o Host)
    peer.on('connection', (c) => {
        conn = c;
        document.getElementById('status').innerText = "Status: Amigo Conectado!";
        setupSync();
    });

    // Botão para entrar no código do amigo (Você é o Guest)
    const btn = document.getElementById('btn-conectar');
    if (btn) {
        btn.onclick = () => {
            const idAmigo = document.getElementById('id-amigo-input').value;
            if (!idAmigo) return alert("Cole o ID do seu amigo primeiro!");
            
            conn = peer.connect(idAmigo);
            document.getElementById('status').innerText = "Status: Conectando...";
            setupSync();
        };
    }

    // Função que sincroniza os dois lados
    function setupSync() {
        conn.on('data', (data) => {
            if (editor && editor.getValue() !== data) {
                isLocalChange = false; // Bloqueia loop infinito
                editor.setValue(data);
                isLocalChange = true;
            }
        });

        conn.on('open', () => {
            document.getElementById('status').innerText = "Status: Sincronizado!";
            // Ao conectar, o host manda o código atual para o guest
            if (editor) conn.send(editor.getValue());
        });
    }
};
