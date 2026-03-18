// Aguarda o HTML carregar 100% para evitar erro de 'null'
window.onload = () => {
    let peer = new Peer(); 
    let conn;
    let editor;
    let isLocalChange = true;

    // Inicializa o Motor do VS Code (Monaco)
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        const container = document.getElementById('editor-container');
        
        editor = monaco.editor.create(container, {
            value: "// Bem-vindo ao Rubi Code!\n// Digite aqui e seu amigo verá.",
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true,
            fontSize: 16
        });

        // Envia mudanças para o parceiro P2P
        editor.onDidChangeModelContent(() => {
            if (isLocalChange && conn && conn.open) {
                conn.send(editor.getValue());
            }
        });
    });

    // Mostra seu ID na tela para você mandar pro amigo
    peer.on('open', (id) => {
        document.getElementById('meu-id').innerText = id;
    });

    // Quando o amigo se conecta em você (Host)
    peer.on('connection', (c) => {
        conn = c;
        document.getElementById('status').innerText = "Status: Amigo Conectado!";
        configurarSinc();
    });

    // Quando você se conecta no amigo (Guest)
    document.getElementById('btn-conectar').onclick = () => {
        const idAmigo = document.getElementById('id-amigo-input').value;
        conn = peer.connect(idAmigo);
        document.getElementById('status').innerText = "Status: Conectando...";
        configurarSinc();
    };

    function configurarSinc() {
        conn.on('data', (data) => {
            if (editor && editor.getValue() !== data) {
                isLocalChange = false; // Trava para não reenviar o que recebeu
                editor.setValue(data);
                isLocalChange = true;
            }
        });
        conn.on('open', () => {
            document.getElementById('status').innerText = "Status: Sincronizado!";
        });
    }
};
