// Lógica de Conexão P2P
const peer = new Peer(); // Cria o seu ID único
let conn;

// Quando seu ID é gerado, mostra na tela
peer.on('open', (id) => {
    console.log('Seu ID no Rubi Code é: ' + id);
    document.getElementById('meu-id').innerText = id;
});

// ESCUTAR: Alguém tentando conectar em você (Host)
peer.on('connection', (connection) => {
    conn = connection;
    configurarMensagens();
    alert("Amigo conectado! Podem programar.");
});

// FUNÇÃO PARA CONECTAR NO AMIGO (Guest)
function conectarAoAmigo() {
    const idAmigo = document.getElementById('id-amigo-input').value;
    conn = peer.connect(idAmigo);
    configurarMensagens();
}

function configurarMensagens() {
    conn.on('data', (data) => {
        // Recebe o texto do amigo e coloca no editor sem criar loop
        const currentContent = window.editor.getValue();
        if (data !== currentContent) {
            window.editor.setValue(data);
        }
    });
}
