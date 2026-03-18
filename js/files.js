const FilesModule = {
    files: {}, // { 'index.html': 'conteudo...' }
    currentFile: null,

    init() {
        document.getElementById('new-file-btn').onclick = () => {
            const name = prompt("Nome do arquivo (ex: app.js):");
            if (name) this.createFile(name, "", true);
        };
    },

    createFile(name, content = "", isLocal = true) {
        if (this.files[name]) return; // Arquivo já existe
        
        this.files[name] = content;
        this.addFileToList(name);
        this.switchFile(name);

        // Notifica o amigo se for uma criação sua
        if (isLocal) {
            P2PModule.send({ type: 'NEW_FILE', name: name });
        }
    },

    addFileToList(name) {
        const list = document.getElementById('file-list');
        const li = document.createElement('li');
        li.id = `file-${name}`;
        li.innerHTML = `<span>📄</span> ${name}`;
        li.onclick = () => this.switchFile(name);
        list.appendChild(li);
    },

    switchFile(name) {
        this.currentFile = name;
        
        // Atualiza UI
        document.querySelectorAll('#file-list li').forEach(el => el.classList.remove('active'));
        document.getElementById(`file-${name}`)?.classList.add('active');
        document.getElementById('active-filename').innerText = name;

        // Atualiza Editor
        EditorModule.instance.setValue(this.files[name]);
        EditorModule.setLanguage(name);
    },

    updateContent(name, content) {
        this.files[name] = content;
    }
};
