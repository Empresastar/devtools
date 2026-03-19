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
                    language: 'javascript',
                    minimap: { enabled: false }
                });
                resolve();
            });
        });
    },

    setLanguage(filename) {
        const ext = filename.split('.').pop();
        const map = { html: 'html', css: 'css', js: 'javascript', json: 'json' };
        const lang = map[ext] || 'javascript';
        monaco.editor.setModelLanguage(this.instance.getModel(), lang);
    },

    runPreview() {
        const code = this.instance.getValue();
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
};
