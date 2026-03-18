let peer = new Peer(); 
let conn;
let editor;
let isLocalChange = true;

// 1. Configurar o Editor Monaco (VS Code original engine)
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
require(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: "// Bem-vindo ao Rubi Code!\n// Digite algo e seu amigo verá em tempo real.",
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 16
    });

    // Envia o código para o amigo quando você digita
    editor.onDidChangeModelContent(() => {
        if (isLocalChange && conn && conn.open) {
            conn.send(editor.getValue());
        }
    });
});

// 2. Gerar ID para o Host
peer.on('open', (id) => {
    document.getElementById('meu-id').innerText = id;
});

// 3. Esperar conexão de um amigo (Você é o Host)
peer.on('connection', (c) => {
    conn = c;
    document.getElementById('status').innerText = "Status: Amigo Conectado!";
    ativarSincronizacao();
});

// 4. Conectar ao ID de um amigo (Você é o Guest)
document.getElementById('btn-conectar').onclick = () => {
    const idAmigo = document.getElementById('id-amigo-input').value;
    conn = peer.connect(idAmigo);
    document.getElementById('status').innerText = "Status: Conectando...";
    ativarSincronizacao();
};

// 5. Função que faz a mágica da sincronização
function ativarSincronizacao() {
    conn.on('data', (data) => {
        if (editor.getValue() !== data) {
            isLocalChange = false; // Trava para não criar loop infinito
            editor.setValue(data);
            isLocalChange = true;
        }
    });

    conn.on('open', () => {
        document.getElementById('status').innerText = "Status: Sincronizado!";
    });
}
