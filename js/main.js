window.onload = async () => {
    let isRemoteUpdate = false; 

    // 1. Inicia o Editor
    await EditorModule.init('monaco-editor');

    // 2. Inicia o P2P e diz o que fazer com os dados recebidos
    P2PModule.init((data) => {
        if (data.type === 'SYNC') {
            isRemoteUpdate = true; // Trava o envio para não dar loop
            const pos = EditorModule.instance.getPosition();
            EditorModule.instance.setValue(data.content);
            EditorModule.instance.setPosition(pos); // Mantém o mouse no lugar
            isRemoteUpdate = false;
        }
        if (data.type === 'FILE') {
            isRemoteUpdate = true;
            EditorModule.instance.setValue(data.content);
            EditorModule.setLanguage(data.name);
            document.getElementById('active-filename').innerText = data.name;
            isRemoteUpdate = false;
        }
    });

    // 3. Botões
    document.getElementById('open-folder-btn').onclick = () => FilesModule.openFolder();
    document.getElementById('preview-btn').onclick = () => EditorModule.runPreview();
    
    document.getElementById('connect-btn').onclick = () => {
        const id = document.getElementById('peer-id-input').value;
        P2PModule.connect(id, (data) => { /* Processa igual ao init */ });
    };

    // 4. ENVIA O CÓDIGO ENQUANTO VOCÊ DIGITA
    EditorModule.instance.onDidChangeModelContent(() => {
        if (!isRemoteUpdate) {
            P2PModule.send({
                type: 'SYNC',
                content: EditorModule.instance.getValue()
            });
        }
    });
};
