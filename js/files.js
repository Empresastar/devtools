const FilesModule = {
    folderHandle: null,

    async openFolder() {
        try {
            this.folderHandle = await window.showDirectoryPicker();
            await this.renderFileList();
        } catch (err) { 
            console.warn("Acesso negado."); 
        }
    },

    async renderFileList() {
        const listUI = document.getElementById('file-list');
        if (!listUI) return;
        listUI.innerHTML = "";
        for await (const entry of this.folderHandle.values()) {
            if (entry.kind === 'file') {
                const li = document.createElement('li');
                li.innerText = "📄 " + entry.name;
                li.style.cursor = "pointer";
                li.onclick = () => this.loadFile(entry);
                listUI.appendChild(li);
            }
        }
    },

    async createFile() {
        if (!this.folderHandle) return alert("Abra uma pasta primeiro!");
        const fileName = prompt("Nome do arquivo (ex: index.html):");
        if (!fileName) return;
        try {
            const fileHandle = await this.folderHandle.getFileHandle(fileName, { create: true });
            await this.renderFileList();
            await this.loadFile(fileHandle);
        } catch (err) { console.error(err); }
    },

    async loadFile(fileHandle) {
        const file = await fileHandle.getFile();
        const content = await file.text();
        EditorModule.instance.setValue(content);
        EditorModule.setLanguage(fileHandle.name);
        document.getElementById('active-filename').innerText = fileHandle.name;
        P2PModule.send({ type: 'FILE', name: fileHandle.name, content: content });
    }
};
