require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});

require(['vs/editor/editor.main'], function() {
    // Criando o editor igual ao VS Code
    window.editor = monaco.editor.create(document.getElementById('container-editor'), {
        value: "// Comece a programar com seu amigo no Rubi Code!\n",
        language: 'javascript',
        theme: 'vs-dark', // O tema clássico
        automaticLayout: true
    });
});

// Lógica simples de convite
document.getElementById('host-btn').addEventListener('click', () => {
    const idSala = Math.random().toString(36).substring(7);
    alert("Passe este código para seu amigo: " + idSala);
    // Aqui você iniciaria a conexão WebRTC
});
