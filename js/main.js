async function startApp() {
    // 1. Inicia o Editor
    const editor = await EditorModule.init('monaco-editor');

    // 2. Inicia o P2P e define o que acontece quando recebe dados
    P2PModule.init((data) => {
        if (data.type === 'CODE_UPDATE') {
            const currentPos = editor.getPosition();
            editor.setValue(data.content);
            editor.setPosition(currentPos);
        }
        if (data.type === 'NEW_FILE') {
            FilesModule.addFileToList(data.name);
        }
    });

    // 3. Evento de Digitação (Envia pro amigo)
    editor.onDidChangeModelContent(() => {
        P2PModule.send({
            type: 'CODE_UPDATE',
            content: editor.getValue()
        });
    });

    // 4. Botão Conectar
    document.getElementById('connect-btn').onclick = () => {
        const id = document.getElementById('peer-id-input').value;
        P2PModule.connect(id, (data) => { /* mesma lógica de recebimento */ });
    };
}

startApp();
