const btn = document.getElementById('btn-scan');
const tree = document.getElementById('tree-content');
let vfs = {};

function addFile(name, lang, type) {
    const div = document.createElement('div');
    div.className = 'file';
    div.innerText = name;
    div.onclick = () => {
        let content;
        if (type === 'root') content = vfs['index.html'].content;
        else if (type === 'css') content = vfs.css[name].content;
        else if (type === 'js') content = vfs.js[name].content;

        editor.setValue(content);
        monaco.editor.setModelLanguage(editor.getModel(), lang);
        document.getElementById('tab-title').innerText = name;
        
        if(lang === 'html') {
            document.getElementById('preview-frame').srcdoc = content;
        }
    };
    tree.appendChild(div);
}

btn.onclick = async () => {
    const urlInput = document.getElementById('url-input').value;
    if(!urlInput) return alert("Insira uma URL!");

    btn.innerText = "Scanning...";
    const data = await scanURL(urlInput);
    
    if(data) {
        vfs = data;
        tree.innerHTML = ""; // Limpa a árvore
        
        // Adiciona os arquivos numerados
        addFile('10. index.html', 'html', 'root');
        
        Object.keys(vfs.css).forEach(f => addFile(f, 'css', 'css'));
        Object.keys(vfs.js).forEach(f => addFile(f, 'javascript', 'js'));
        
        // Abre o index no editor e no preview automaticamente
        editor.setValue(vfs['index.html'].content);
        monaco.editor.setModelLanguage(editor.getModel(), 'html');
        document.getElementById('preview-frame').srcdoc = vfs['index.html'].content;
    }
    btn.innerText = "Scan";
};
