// Este arquivo cuida só da conexão
const P2PModule = {
    peer: null,
    connection: null,

    init(callbackSucesso) {
        // Criando o objeto Peer
        this.peer = new Peer();

        // Evento que gera o ID
        this.peer.on('open', (id) => {
            console.log("ID Criado:", id);
            const campoId = document.getElementById('display-id');
            if (campoId) {
                campoId.innerText = id;
                campoId.style.color = "#00ffcc"; // Fica verde quando o ID aparece
            }
        });

        // Receber conexão de amigo
        this.peer.on('connection', (conn) => {
            this.connection = conn;
            this.setupEvents(callbackSucesso);
        });

        // Caso dê erro (importante para debugar)
        this.peer.on('error', (err) => {
            console.error("Erro no P2P:", err);
            document.getElementById('display-id').innerText = "Erro de Conexão";
        });
    },

    // Conectar no amigo
    connect(idAmigo, callbackSucesso) {
        this.connection = this.peer.connect(idAmigo);
        this.setupEvents(callbackSucesso);
    },

    setupEvents(callbackSucesso) {
        this.connection.on('open', () => {
            document.getElementById('sync-status').innerText = "Conectado!";
        });
        this.connection.on('data', (data) => {
            callbackSucesso(data);
        });
    },

    send(dados) {
        if (this.connection && this.connection.open) {
            this.connection.send(dados);
        }
    }
};
