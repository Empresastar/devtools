window.onload = async () => {
    let isRemoteUpdate = false; 

    await EditorModule.init('monaco-editor');

    const handleData = (data) => {
        if (data.type === 'SYNC') {
            isRemoteUpdate = true;
            const pos = EditorModule.instance.getPosition();
            EditorModule.instance.setValue(data.content);
            EditorModule.instance.setPosition(pos);
            setTimeout(() => { isRemoteUpdate = false; }, 50);
        }
        // Quando o HOST abre uma pasta/arquivo, o CLIENT recebe aqui:
        if (data.type === 'FILE') {
            isRemoteUpdate = true;
            EditorModule.instance.setValue(data.content);
            EditorModule.setLanguage(data.name);
            const nameDisplay = document.getElementById('active-filename');
            if (nameDisplay) nameDisplay.innerText = data.name;
            setTimeout(() => { isRemoteUpdate = false; }, 50);
        }
    };

    P2PModule.init(handleData);

    // Botões
    const btnFolder = document.getElementById('open-folder-btn');
    if (btnFolder) btnFolder.onclick = () => FilesModule.openFolder();

    const btnConnect = document.getElementById('connect-btn');
    if (btnConnect) {
        btnConnect.onclick = () => {
            const input = document.getElementById('peer-id-input');
            if (input && input.value) P2PModule.connect(input.value, handleData);
        };
    }

    EditorModule.instance.onDidChangeModelContent(() => {
        if (!isRemoteUpdate) {
            P2PModule.send({
                type: 'SYNC',
                content: EditorModule.instance.getValue()
            });
        }
    });
};
