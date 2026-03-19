const P2PModule = {
    peer: null,
    connection: null,

    init(onDataReceived) {
        // Cria o ID PeerJS
        this.peer = new Peer();

        this.peer.on('open', (id) => {
            console.log("Meu ID:", id);
            const el = document.getElementById('display-id');
            if (el) el.innerText = id;
        });

        // Escuta quem tenta conectar em você
        this.peer.on('connection', (conn) => {
            this.setupConn(conn, onDataReceived);
        });

        this.peer.on('error', (err) => {
            console.error("Erro no PeerJS:", err);
            const el = document.getElementById('display-id');
            if (el) el.innerText = "Erro!";
        });
    },

    connect(targetId, onDataReceived) {
        if (!targetId) return alert("Cadê o ID do amigo?");
        const conn = this.peer.connect(targetId);
        this.setupConn(conn, onDataReceived);
    },

    setupConn(conn, onDataReceived) {
        this.connection = conn;
        
        conn.on('open', () => {
            console.log("Conectado!");
            const status = document.getElementById('sync-status');
            if (status) {
                status.innerText = "🟢 Conectado";
                status.style.background = "#28a745";
            }
            alert("Conectado com sucesso!");
        });

        conn.on('data', (data) => {
            onDataReceived(data);
        });
    },

    send(data) {
        if (this.connection && this.connection.open) {
            this.connection.send(data);
        }
    }
};
