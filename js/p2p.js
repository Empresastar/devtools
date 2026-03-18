const P2PModule = {
    peer: new Peer(),
    connection: null,

    init(onDataReceived) {
        this.peer.on('open', id => document.getElementById('display-id').innerText = id);
        this.peer.on('connection', conn => this.setupConn(conn, onDataReceived));
    },

    connect(targetId, onDataReceived) {
        const conn = this.peer.connect(targetId);
        this.setupConn(conn, onDataReceived);
    },

    setupConn(conn, onDataReceived) {
        this.connection = conn;
        conn.on('data', onDataReceived);
        conn.on('open', () => document.getElementById('sync-status').innerText = "Conectado");
    },

    send(data) {
        if (this.connection && this.connection.open) {
            this.connection.send(data);
        }
    }
};
