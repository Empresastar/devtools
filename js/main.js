window.onload = async () => {
    let isRemoteUpdate = false; 

    await EditorModule.init('monaco-editor').catch(() => console.error("Erro Editor"));

    const handleData = (data) => {
        // SINCRONIZA A LISTA DE ARQUIVOS (Para o Client ver a pasta)
        if (data.type === 'FOLDER_SYNC') {
            FilesModule.renderFileList(data.files);
        }

        // SINCRONIZA O CONTEÚDO DO EDITOR E NOME DO ARQUIVO
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
