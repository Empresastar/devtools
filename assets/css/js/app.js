const btnScan = document.getElementById('btn-scan');
const urlInput = document.getElementById('url-input');
const treeContent = document.getElementById('tree-content');
const previewFrame = document.getElementById('preview-frame');
const currentTab = document.querySelector('.tab');

let virtualFileSystem = {};

// Função para montar a árvore visual na esquerda
function renderTree(vfs) {
    treeContent.innerHTML = ""; // Limpa a árvore anterior

    // 10. Index Principal
    createFileElement('10. index.html', 'index.html', 'html');

    // 11. Pasta CSS
    const cssFolder = createFolderElement('11. css');
    Object.keys(vfs.css).forEach(file => {
        createFileElement(`- ${file}`, file, 'css', cssFolder);
    });

    // 12. Pasta JS
    const jsFolder = createFolderElement('12. js');
    Object.keys(vfs.js).forEach(file => {
        createFileElement(`- ${file}`, file, 'javascript', jsFolder);
    });
}

function createFolderElement(name) {
    const div = document.createElement('div');
    div.className = 'folder-root';
    div.style.marginLeft = "10px";
    div.style.marginTop = "10px";
    div.innerText = name;
    treeContent.appendChild(div);
    return div;
}

function createFileElement(displayName, fileName, lang, parent = treeContent) {
    const div = document.createElement('div');
    div.className = 'file';
    div.style.marginLeft = "20px";
    div.innerText = displayName;
    div.onclick = () => {
        // Remove ativo de outros
        document.querySelectorAll('.file').forEach(f => f.classList.remove('active'));
        div.classList.add('active');
        
        // Abre no editor
        openInEditor(fileName, lang);
    };
    parent.appendChild(div);
}

function openInEditor(fileName, lang) {
    currentTab.innerText = fileName;
    let content = "";

    if (fileName === 'index.html') {
        content = virtualFileSystem['index.html'].content;
    } else if (virtualFileSystem.css[fileName]) {
        content = virtualFileSystem.css[fileName].content;
    } else if (virtualFileSystem.js[fileName]) {
        content = virtualFileSystem.js[fileName].content;
    }

    editor.setValue(content);
    monaco.editor.setModelLanguage(editor.getModel(), lang);
    updatePreview();
}

// 15. O Executor (Atualiza o Iframe)
function updatePreview() {
    const code = editor.getValue();
    // Se for HTML, renderiza direto. Se for CSS/JS, precisaria injetar (simplificado aqui)
    if (currentTab.innerText.includes('html')) {
        previewFrame.srcdoc = code;
    }
}

// Ação do Botão SCAN
btnScan.addEventListener('click', async () => {
    const url = urlInput.value;
    if (!url) return alert("Insira uma URL!");

    btnScan.innerText = "Scanning...";
    const result = await scanURL(url);
    
    if (result) {
        virtualFileSystem = result;
        renderTree(result);
        editor.setValue(result['index.html'].content);
        monaco.editor.setModelLanguage(editor.getModel(), 'html');
        updatePreview();
    }
    btnScan.innerText = "Scan";
});

// Atualiza preview ao digitar
if (editor) {
    editor.onDidChangeModelContent(() => {
        updatePreview();
    });
}
