window.onload = async () => {
    let isRemoteChange = false; // Trava para evitar loop infinito de mensagens

    await EditorModule.init('monaco-editor');

    P2PModule.init((data) => {
        if (data.type === 'EDIT') {
            isRemoteChange = true; // Avisa que a mudança veio de fora
            const currentPos = EditorModule.instance.getPosition();
            EditorModule.instance.setValue(data.content);
            EditorModule.instance.setPosition(currentPos);
            isRemoteChange = false;
        }
        if (data.type === 'OPEN_FILE') {
            isRemoteChange = true;
            EditorModule.instance.setValue(data.content);
            EditorModule.setLanguage(data.name);
            document.getElementById('active-filename').innerText = data.name;
            isRemoteChange = false;
        }
    });

    // Configuração dos Botões
    document.getElementById('open-folder-btn').onclick = () => FilesModule.openFolder();
    document.getElementById('preview-btn').onclick = () => EditorModule.runPreview();
    
    document.getElementById('connect-btn').onclick = () => {
        const inputId = document.getElementById('peer-id-input').value;
        P2PModule.connect(inputId, (data) => { /* Processa igual ao init */ });
    };

    // SINCRONIZAÇÃO: Envia o código se a mudança for LOCAL (você digitando)
    EditorModule.instance.onDidChangeModelContent(() => {
        if (!isRemoteChange) {
            P2PModule.send({
                type: 'EDIT',
                content: EditorModule.instance.getValue()
            });
        }
    });
};
