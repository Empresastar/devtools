const EditorModule = {
    instance: null,
    init(idDiv) {
        return new Promise((resolve) => {
            require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
            require(['vs/editor/editor.main'], () => {
                this.instance = monaco.editor.create(document.getElementById(idDiv), {
                    theme: 'vs-dark',
                    automaticLayout: true,
                    fontSize: 14,
                    language: 'javascript'
                });
                resolve();
            });
        });
    },
    // Esta função detecta a linguagem pelo final do nome do arquivo
    setLanguage(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const map = { 
            'html': 'html', 
            'css': 'css', 
            'js': 'javascript', 
            'ts': 'typescript',
            'json': 'json', 
            'py': 'python', 
            'php': 'php',
            'sql': 'sql',
            'md': 'markdown'
        };
        const language = map[ext] || 'plaintext'; // Se não conhecer, abre como texto comum
        monaco.editor.setModelLanguage(this.instance.getModel(), language);
    }
};
