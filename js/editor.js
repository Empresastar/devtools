const EditorModule = {
    instance: null,
    
    init(containerId) {
        return new Promise((resolve) => {
            require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
            require(['vs/editor/editor.main'], () => {
                this.instance = monaco.editor.create(document.getElementById(containerId), {
                    theme: 'vs-dark',
                    automaticLayout: true,
                    fontSize: 14,
                    fontFamily: 'Fira Code, Consolas, monospace',
                    minimap: { enabled: true }
                });
                resolve(this.instance);
            });
        });
    },

    setLanguage(filename) {
        const ext = filename.split('.').pop();
        const map = { html: 'html', css: 'css', js: 'javascript', json: 'json' };
        monaco.editor.setModelLanguage(this.instance.getModel(), map[ext] || 'javascript');
    }
};
