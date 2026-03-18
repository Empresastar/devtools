const P2PModule = {
    peer: null,
    connection: null,

    init(onDataReceived) {
        this.peer = new Peer();

        this.peer.on('open', (id) => {
            const display = document.getElementById('display-id');
            if (display) display.innerText = id;
        });

        this.peer.on('connection', (conn) => {
            this.setupConn(conn, onDataReceived);
        });

        this.peer.on('error', (err) => {
            console.error("Erro P2P:", err);
            document.getElementById('display-id').innerText = "Erro";
        });
    },

    connect(targetId, onDataReceived) {
        if (!targetId) return alert("Digite o ID do amigo!");
        const conn = this.peer.connect(targetId);
        this.setupConn(conn, onDataReceived);
    },

    setupConn(conn, onDataReceived) {
        this.connection = conn;
        
        conn.on('open', () => {
            const statusLabel = document.getElementById('sync-status');
            if (statusLabel) {
                statusLabel.innerText = "🟢 Conectado com Parceiro";
                statusLabel.style.background = "#28a745";
                statusLabel.style.color = "white";
                statusLabel.style.padding = "2px 8px";
                statusLabel.style.borderRadius = "4px";
            }
            alert("Rubi Code: Conexão estabelecida! Ambos podem editar.");
        });

        conn.on('data', (data) => onDataReceived(data));

        conn.on('close', () => {
            const statusLabel = document.getElementById('sync-status');
            if (statusLabel) {
                statusLabel.innerText = "🔴 Desconectado";
                statusLabel.style.background = "#dc3545";
            }
        });
    },

    send(data) {
        if (this.connection && this.connection.open) {
            this.connection.send(data);
        }
    }
};
