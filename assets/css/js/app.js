const btn = document.getElementById('btn-scan');
const tree = document.getElementById('tree-content');
let vfs = {};

function addFile(name, lang, type) {
    const div = document.createElement('div');
    div.className = 'file';
    div.innerText = name;
    div.onclick = () => {
        let content = (type === 'root') ? vfs[name].content : vfs[type][name].content;
        editor.setValue(content);
        monaco.editor.setModelLanguage(editor.getModel(), lang);
        document.getElementById('tab-title').innerText = name;
        if(lang === 'html') document.getElementById('preview-frame').srcdoc = content;
    };
    tree.appendChild(div);
}

btn.onclick = async () => {
    const url = document.getElementById('url-input').value;
    btn.innerText = "Carregando...";
    const data = await scanURL(url);
    if(data) {
        vfs = data;
        tree.innerHTML = "";
        addFile('index.html', 'html', 'root');
        Object.keys(vfs.css).forEach(f => addFile(f, 'css', 'css'));
        Object.keys(vfs.js).forEach(f => addFile(f, 'javascript', 'js'));
        editor.setValue(vfs['index.html'].content);
        document.getElementById('preview-frame').srcdoc = vfs['index.html'].content;
    }
    btn.innerText = "Scan";
};
