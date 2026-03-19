window.onload = async () => {
    let isRemoteUpdate = false; 

    await EditorModule.init('monaco-editor');

    // FUNÇÃO QUE TRATA O RECEBIMENTO (Igual para Host e Client)
    const handleData = (data) => {
        if (data.type === 'SYNC') {
            isRemoteUpdate = true; // Bloqueia o envio enquanto atualiza o que recebeu
            const pos = EditorModule.instance.getPosition();
            EditorModule.instance.setValue(data.content);
            EditorModule.instance.setPosition(pos); // Mantém o cursor no lugar
            setTimeout(() => { isRemoteUpdate = false; }, 50); // Destrava após a escrita
        }
    };

    // Inicia o P2P passando a função de tratar dados
    P2PModule.init(handleData);

    // Botões com proteção contra erro NULL
    const btnFolder = document.getElementById('open-folder-btn');
    if (btnFolder) btnFolder.onclick = () => FilesModule.openFolder();

    const btnConnect = document.getElementById('connect-btn');
    if (btnConnect) {
        btnConnect.onclick = () => {
            const input = document.getElementById('peer-id-input');
            if (input && input.value) {
                P2PModule.connect(input.value, handleData);
            }
        };
    }

    // SINCRONIZAÇÃO: Quando QUALQUER UM digitar, envia para o outro
    EditorModule.instance.onDidChangeModelContent(() => {
        if (!isRemoteUpdate) {
            P2PModule.send({
                type: 'SYNC',
                content: EditorModule.instance.getValue()
            });
        }
    });
};
