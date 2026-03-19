window.onload = async () => {
    let isRemoteUpdate = false; 

    // Tenta iniciar o editor na div 'monaco-editor'
    await EditorModule.init('monaco-editor').catch(() => alert("Erro ao carregar editor"));

    const handleData = (data) => {
        if (data.type === 'SYNC' || data.type === 'FILE') {
            isRemoteUpdate = true;
            if (data.type === 'FILE') {
                EditorModule.setLanguage(data.name);
                document.getElementById('active-filename').innerText = data.name;
            }
            const pos = EditorModule.instance.getPosition();
            EditorModule.instance.setValue(data.content);
            EditorModule.instance.setPosition(pos);
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
