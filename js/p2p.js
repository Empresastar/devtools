const P2PModule = {
    peer: null,
    connection: null,

    init(onDataReceived) {
        this.peer = new Peer();
        this.peer.on('open', (id) => {
            const el = document.getElementById('display-id');
            if (el) el.innerText = id;
        });

        // O HOST recebe a conexão aqui
        this.peer.on('connection', (conn) => {
            this.setupConn(conn, onDataReceived);
        });
    },

    connect(targetId, onDataReceived) {
        // O CLIENT inicia a conexão aqui
        const conn = this.peer.connect(targetId);
        this.setupConn(conn, onDataReceived);
    },

    setupConn(conn, onDataReceived) {
        this.connection = conn;
        conn.on('open', () => {
            const status = document.getElementById('sync-status');
            if (status) {
                status.innerText = "🟢 Sincronizado";
                status.style.background = "#28a745";
            }
            alert("Conectado! Ambos podem editar agora.");
        });

        // ESCUTA OS DADOS (Funciona para os dois lados)
        conn.on('data', (data) => onDataReceived(data));
    },

    send(data) {
        if (this.connection && this.connection.open) {
            this.connection.send(data);
        }
    }
};
