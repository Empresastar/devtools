window.onload = async () => {
    let isRemoteUpdate = false; 

    try {
        await EditorModule.init('monaco-editor');
    } catch (e) {
        console.error("Erro no Editor:", e);
    }

    const handleData = (data) => {
        if (data.type === 'SYNC') {
            isRemoteUpdate = true;
            const pos = EditorModule.instance.getPosition();
            EditorModule.instance.setValue(data.content);
            EditorModule.instance.setPosition(pos);
            setTimeout(() => { isRemoteUpdate = false; }, 50);
        }
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

    const btnFolder = document.getElementById('open-folder-btn');
    if (btnFolder) btnFolder.onclick = () => FilesModule.openFolder();

    const btnCreate = document.getElementById('create-file-btn');
    if (btnCreate) btnCreate.onclick = () => FilesModule.createFile();
    
    const btnConnect = document.getElementById('connect-btn');
    if (btnConnect) {
        btnConnect.onclick = () => {
            const input = document.getElementById('peer-id-input');
            if (input) P2PModule.connect(input.value, handleData);
        };
    }

    if (EditorModule.instance) {
        EditorModule.instance.onDidChangeModelContent(() => {
            if (!isRemoteUpdate) {
                P2PModule.send({ type: 'SYNC', content: EditorModule.instance.getValue() });
            }
        });
    }
};
