// Espera tudo carregar para não dar erro de "null"
window.onload = () => {
    let peer = new Peer(); 
    let conn;
    let editor;
    let isLocalChange = true;

    // Configurar o Editor Monaco
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        const container = document.getElementById('editor-container');
        
        if (container) {
            editor = monaco.editor.create(container, {
                value: "// Rubi Code pronto para o P2P!\n",
                language: 'javascript',
                theme: 'vs-dark',
                automaticLayout: true
            });

            editor.onDidChangeModelContent(() => {
                if (isLocalChange && conn && conn.open) {
                    conn.send(editor.getValue());
                }
            });
        }
    });

    peer.on('open', (id) => {
        document.getElementById('meu-id').innerText = id;
    });

    peer.on('connection', (c) => {
        conn = c;
        document.getElementById('status').innerText = "Status: Amigo Conectado!";
        ativarSincronizacao();
    });

    // Só adiciona o evento se o botão existir
    const btnConectar = document.getElementById('btn-conectar');
    if (btnConectar) {
        btnConectar.onclick = () => {
            const idAmigo = document.getElementById('id-amigo-input').value;
            conn = peer.connect(idAmigo);
            document.getElementById('status').innerText = "Status: Conectando...";
            ativarSincronizacao();
        };
    }

    function ativarSincronizacao() {
        conn.on('data', (data) => {
            if (editor && editor.getValue() !== data) {
                isLocalChange = false;
                editor.setValue(data);
                isLocalChange = true;
            }
        });
        conn.on('open', () => {
            document.getElementById('status').innerText = "Status: Sincronizado!";
        });
    }
};
