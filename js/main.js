window.onload = async () => {
    let isRemoteUpdate = false; // Bloqueio para evitar loop de sincronização

    // 1. Inicia o Editor
    await EditorModule.init('monaco-editor');

    // 2. Inicia o P2P e define o que fazer ao receber dados do outro
    P2PModule.init((data) => {
        if (data.type === 'SYNC_CODE') {
            isRemoteUpdate = true; // Trava o envio local
            
            const currentPosition = EditorModule.instance.getPosition();
            EditorModule.instance.setValue(data.content);
            EditorModule.instance.setPosition(currentPosition); // Mantém o cursor onde estava
            
            isRemoteUpdate = false; // Destrava
        }
        
        if (data.type === 'FILE_OPENED') {
            isRemoteUpdate = true;
            EditorModule.instance.setValue(data.content);
            EditorModule.setLanguage(data.name);
            document.getElementById('active-filename').innerText = data.name;
            isRemoteUpdate = false;
        }
    });

    // 3. Captura cada mudança no código (como se fosse um chat de texto)
    EditorModule.instance.onDidChangeModelContent(() => {
        if (!isRemoteUpdate) {
            P2PModule.send({
                type: 'SYNC_CODE',
                content: EditorModule.instance.getValue()
            });
        }
    });

    // 4. Configura os botões da Interface
    document.getElementById('open-folder-btn').onclick = () => FilesModule.openFolder();
    document.getElementById('preview-btn').onclick = () => EditorModule.runPreview();
    
    document.getElementById('connect-btn').onclick = () => {
        const targetId = document.getElementById('peer-id-input').value;
        P2PModule.connect(targetId, (data) => {
            // A lógica de recebimento é a mesma do init
        });
    };
};
