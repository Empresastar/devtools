/**
 * ARQUIVO 7: LÓGICA DE INTERFACE (COMPLETO)
 * Controla a árvore de arquivos numerada, o clique nas pastas e o Preview.
 */

const btnScan = document.getElementById('btn-scan');
const urlInput = document.getElementById('url-input');
const treeContent = document.getElementById('tree-content');
const previewFrame = document.getElementById('preview-frame');
const tabTitle = document.getElementById('tab-title');

let vfsGlobal = {}; // Armazena os arquivos capturados pelo scanner

/**
 * Monta a árvore visual na barra lateral com a numeração correta
 */
function buildFileTree(vfs) {
    treeContent.innerHTML = ""; // Limpa a árvore anterior para não duplicar

    // 10. Arquivo principal (Raiz)
    addFileToTree("10. index.html", "index.html", "html", "root");

    // 11. Pasta de Estilos (CSS)
    const cssKeys = Object.keys(vfs.css);
    if (cssKeys.length > 0) {
        addFolderToTree("11. css");
        cssKeys.forEach((file) => {
            addFileToTree(`   - ${file}`, file, 'css', 'css');
        });
    }

    // 12. Pasta de Scripts (JS)
    const jsKeys = Object.keys(vfs.js);
    if (jsKeys.length > 0) {
        addFolderToTree("12. js");
        jsKeys.forEach((file) => {
            addFileToTree(`   - ${file}`, file, 'javascript', 'js');
        });
    }
}

/**
 * Cria o elemento visual da pasta
 */
function addFolderToTree(name) {
    const div = document.createElement('div');
    div.className = 'folder-root';
    div.style.padding = "5px 10px";
    div.style.fontWeight = "bold";
    div.style.color = "#858585";
    div.innerText = name;
    treeContent.appendChild(div);
}

/**
 * Cria o elemento visual do arquivo e configura o clique
 */
function addFileToTree(label, fileName, lang, type) {
    const div = document.createElement('div');
    div.className = 'file';
    div.innerText = label;
    
    div.onclick = () => {
        // Estilo de seleção (active)
        document.querySelectorAll('.file').forEach(f => f.classList.remove('active'));
        div.classList.add('active');
        
        // Carrega o conteúdo no editor
        loadFileIntoEditor(fileName, lang, type);
    };
    
    treeContent.appendChild(div);
}

/**
 * Pega o conteúdo do Sistema de Arquivos Virtual e joga no Editor
 */
function loadFileIntoEditor(name, lang, type) {
    tabTitle.innerText = name;
    let content = "";

    if (type === 'root') {
        content = vfsGlobal['index.html'].content;
    } else if (type === 'css') {
        content = vfsGlobal.css[name].content;
    } else if (type === 'js') {
        content = vfsGlobal.js[name].content;
    }

    // Garante que o editor existe antes de setar valor
    if (typeof editor !== 'undefined') {
        editor.setValue(content);
        monaco.editor.setModelLanguage(editor.getModel(), lang);
        
        // Se for HTML, já atualiza o preview na hora
        if (lang === 'html') {
            updateLivePreview(content);
        }
    }
}

/**
 * 15. O EXECUTOR (Preview)
 * Pega o código do editor e renderiza no Iframe
 */
function updateLivePreview(htmlCode) {
    if (previewFrame) {
        previewFrame.srcdoc = htmlCode;
    }
}

/**
 * Evento do Botão Scan (Chama o Arquivo 6: scanner.js)
 */
btnScan.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) {
        alert("Por favor, cole uma URL primeiro.");
        return;
    }

    btnScan.innerText = "Scanning...";
    btnScan.disabled = true;

    // Função scanURL vem do arquivo scanner.js
    const data = await scanURL(url);
    
    if (data) {
        vfsGlobal = data;
        buildFileTree(data);
        
        // Abre o index.html automaticamente após o scan
        loadFileIntoEditor('index.html', 'html', 'root');
    }

    btnScan.innerText = "Scan";
    btnScan.disabled = false;
});

/**
 * Listener de Atualização Real-time
 * Sempre que você digitar no editor, o preview atualiza se for o index.html
 */
setInterval(() => {
    if (typeof editor !== 'undefined' && tabTitle.innerText === 'index.html') {
        const currentCode = editor.getValue();
        // Só atualiza se o código mudou para não pesar o navegador
        if (previewFrame.srcdoc !== currentCode) {
            updateLivePreview(currentCode);
        }
    }
}, 1500);
