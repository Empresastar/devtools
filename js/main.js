window.onload = async () => {
    let isRemoteUpdate = false; 

    // 1. Inicia o Editor (Motor de Cores)
    await EditorModule.init('monaco-editor');

    // 2. Inicia o P2P e define o que fazer com os dados recebidos
    P2PModule.init((data) => {
        if (data.type === 'SYNC') {
            isRemoteUpdate = true; // Trava o envio para não dar loop
            const pos = EditorModule.instance.getPosition();
            EditorModule.instance.setValue(data.content);
            EditorModule.instance.setPosition(pos); // Mantém o cursor no lugar
            isRemoteUpdate = false;
        }
        if (data.type === 'FILE') {
            isRemoteUpdate = true;
            EditorModule.instance.setValue(data.content);
            EditorModule.setLanguage(data.name);
            const fileNameEl = document.getElementById('active-filename');
            if (fileNameEl) fileNameEl.innerText = data.name;
            isRemoteUpdate = false;
        }
    });

    // 3. Botões (Com verificação de segurança para não dar erro de NULL)
    const btnFolder = document.getElementById('open-folder-btn');
    if (btnFolder) {
        btnFolder.onclick = () => FilesModule.openFolder();
    }

    const btnPreview = document.getElementById('preview-btn');
    if (btnPreview) {
        btnPreview.onclick = () => EditorModule.runPreview();
    }
    
    const btnConnect = document.getElementById('connect-btn');
    if (btnConnect) {
        btnConnect.onclick = () => {
            const input = document.getElementById('peer-id-input');
            if (input && input.value) {
                P2PModule.connect(input.value, (data) => {
                    // O processamento aqui é automático pelo P2PModule
                });
            } else {
                alert("Por favor, digite o ID do seu amigo.");
            }
        };
    }

    // 4. ENVIA O CÓDIGO ENQUANTO VOCÊ DIGITA (Sincronização em tempo real)
    EditorModule.instance.onDidChangeModelContent(() => {
        if (!isRemoteUpdate) {
            P2PModule.send({
                type: 'SYNC',
                content: EditorModule.instance.getValue()
            });
        }
    });
};
