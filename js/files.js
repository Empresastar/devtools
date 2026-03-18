const FilesModule = {
    folderHandle: null,
    files: {}, 

    async openFolder() {
        try {
            this.folderHandle = await window.showDirectoryPicker();
            const listUI = document.getElementById('file-list');
            listUI.innerHTML = "";
            
            for await (const entry of this.folderHandle.values()) {
                if (entry.kind === 'file') {
                    const li = document.createElement('li');
                    li.innerHTML = `<span>📄</span> ${entry.name}`;
                    li.onclick = () => this.loadFile(entry);
                    listUI.appendChild(li);
                }
            }
        } catch (err) {
            console.error("Acesso negado ou cancelado.");
        }
    },

    async loadFile(fileHandle) {
        const file = await fileHandle.getFile();
        const content = await file.text();
        
        EditorModule.instance.setValue(content);
        EditorModule.setLanguage(fileHandle.name);
        document.getElementById('active-filename').innerText = fileHandle.name;

        P2PModule.send({
            type: 'OPEN_FILE',
            name: fileHandle.name,
            content: content
        });
    }
};
