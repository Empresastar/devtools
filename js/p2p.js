const P2PModule = {
    peer: null,
    connection: null,

    init(onDataReceived) {
        this.peer = new Peer();

        this.peer.on('open', (id) => {
            const display = document.getElementById('display-id');
            if (display) display.innerText = id;
        });

        // Quando alguém conecta no seu ID
        this.peer.on('connection', (conn) => {
            this.setupConn(conn, onDataReceived);
        });

        this.peer.on('error', (err) => console.error("Erro P2P:", err));
    },

    connect(targetId, onDataReceived) {
        if (!targetId) return alert("Insira o ID do parceiro!");
        const conn = this.peer.connect(targetId);
        this.setupConn(conn, onDataReceived);
    },

    setupConn(conn, onDataReceived) {
        this.connection = conn;
        
        conn.on('open', () => {
            const status = document.getElementById('sync-status');
            if (status) {
                status.innerText = "🟢 Sincronizado";
                status.style.color = "#00ffcc";
            }
            console.log("Sistema de Sincronização Ativo!");
        });

        conn.on('data', (data) => onDataReceived(data));
    },

    send(data) {
        if (this.connection && this.connection.open) {
            this.connection.send(data);
        }
    }
};
