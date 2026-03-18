window.onload = async () => {
    // 1. Inicia o Editor
    await EditorModule.init('monaco-editor');

    // 2. Inicia P2P e define o que fazer ao receber dados
    P2PModule.init((data) => {
        if (data.type === 'EDIT') {
            const currentPos = EditorModule.instance.getPosition();
            EditorModule.instance.setValue(data.content);
            EditorModule.instance.setPosition(currentPos);
        }
        if (data.type === 'OPEN_FILE') {
            EditorModule.instance.setValue(data.content);
            EditorModule.setLanguage(data.name);
            document.getElementById('active-filename').innerText = data.name;
        }
    });

    // 3. Botão Abrir Pasta (Usa a FilesModule que você já tem)
    const btnFolder = document.getElementById('open-folder-btn');
    if (btnFolder) {
        btnFolder.onclick = () => FilesModule.openFolder();
    }

    // 4. Botão Preview
    const btnPreview = document.getElementById('preview-btn');
    if (btnPreview) {
        btnPreview.onclick = () => EditorModule.runPreview();
    }

    // 5. Botão Conectar
    const btnConnect = document.getElementById('connect-btn');
    if (btnConnect) {
        btnConnect.onclick = () => {
            const inputId = document.getElementById('peer-id-input').value;
            P2PModule.connect(inputId, (data) => {
                // Aqui processa os mesmos dados recebidos acima
            });
        };
    }

    // 6. SINCRONIZAÇÃO EM TEMPO REAL
    // Sempre que você digitar, envia o texto pro amigo
    EditorModule.instance.onDidChangeModelContent(() => {
        P2PModule.send({
            type: 'EDIT',
            content: EditorModule.instance.getValue()
        });
    });
};
