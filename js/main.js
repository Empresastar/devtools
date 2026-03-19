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
        if (data.type === 'FILE') {
            isRemoteUpdate = true;
            EditorModule.instance.setValue(data.content);
            EditorModule.setLanguage(data.name); // Sincroniza a linguagem no outro PC
            document.getElementById('active-filename').innerText = data.name;
            setTimeout(() => { isRemoteUpdate = false; }, 50);
        }
    };

    P2PModule.init(handleData);

    document.getElementById('open-folder-btn').onclick = () => FilesModule.openFolder();
    document.getElementById('create-file-btn').onclick = () => FilesModule.createFile();
    
    document.getElementById('connect-btn').onclick = () => {
        const id = document.getElementById('peer-id-input').value;
        if(id) P2PModule.connect(id, handleData);
    };

    EditorModule.instance.onDidChangeModelContent(() => {
        if (!isRemoteUpdate) {
            P2PModule.send({ type: 'SYNC', content: EditorModule.instance.getValue() });
        }
    });
};
