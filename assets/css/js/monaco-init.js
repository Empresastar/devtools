// Configuração do carregador do Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' }});

let editor;

require(['vs/editor/editor.main'], function() {
    // Inicializa o editor na div monaco-editor
    editor = monaco.editor.create(document.getElementById('monaco-editor'), {
        value: "/* 1. Selecione uma URL para começar o scan\n   2. Os arquivos aparecerão na esquerda\n   3. Edite o código e teste no preview */\n\nfunction testeSistema() {\n    console.log('Sistema Ativo');\n}",
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: true }
    });
    
    console.log("Motor Monaco carregado com sucesso!");
});
