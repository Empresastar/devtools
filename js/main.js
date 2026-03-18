window.onload = async () => {
    // Inicia o motor do editor
    await EditorModule.init('monaco-editor');

    // Inicia o P2P e escuta o amigo
    P2PModule.init((data) => {
        if (data.type === 'EDIT') {
            const pos = EditorModule.instance.getPosition();
            EditorModule.instance.setValue(data.content);
            EditorModule.instance.setPosition(pos);
        }
        if (data.type === 'OPEN_FILE') {
            EditorModule.instance.setValue(data.content);
            EditorModule.setLanguage(data.name);
            document.getElementById('active-filename').innerText = data.name;
        }
    });

    // Configura Botões
    document.getElementById('open-folder-btn').onclick = () => FilesModule.openFolder();
    document.getElementById('preview-btn').onclick = () => EditorModule.runPreview();
    
    document.getElementById('connect-btn').onclick = () => {
        const id = document.getElementById('peer-id-input').value;
        P2PModule.connect(id, (data) => { /* recebe os mesmos dados */ });
    };

    // Sincroniza Digitação (O que você faz, o outro vê)
    EditorModule.instance.onDidChangeModelContent(() => {
        P2PModule.send({
            type: 'EDIT',
            content: EditorModule.instance.getValue()
        });
    });
};
