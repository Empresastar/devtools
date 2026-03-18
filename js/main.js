window.onload = async () => {
    // 1. Inicia o Editor (Cores)
    await EditorModule.init('monaco-editor');

    // 2. Inicia o P2P (ID)
    P2PModule.init((dados) => {
        // Quando receber código do amigo
        if (dados.type === 'CODE') {
            EditorModule.instance.setValue(dados.content);
        }
    });

    // 3. Configura o botão de Conectar
    document.getElementById('connect-btn').onclick = () => {
        const id = document.getElementById('peer-id-input').value;
        P2PModule.connect(id, (dados) => {
            if (dados.type === 'CODE') {
                EditorModule.instance.setValue(dados.content);
            }
        });
    };

    // 4. Enviar código enquanto digita
    EditorModule.instance.onDidChangeModelContent(() => {
        P2PModule.send({
            type: 'CODE',
            content: EditorModule.instance.getValue()
        });
    });
};
