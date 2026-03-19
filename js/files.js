const FilesModule = {
    folderHandle: null,

    async openFolder() {
        try {
            // Abre o seletor de pastas do sistema
            this.folderHandle = await window.showDirectoryPicker();
            const listUI = document.getElementById('file-list');
            if (listUI) listUI.innerHTML = "";
            
            for await (const entry of this.folderHandle.values()) {
                if (entry.kind === 'file') {
                    const li = document.createElement('li');
                    li.innerHTML = `<span>📄</span> ${entry.name}`;
                    li.style.cursor = "pointer";
                    li.onclick = () => this.loadFile(entry);
                    if (listUI) listUI.appendChild(li);
                }
            }
        } catch (err) {
            console.log("Usuário cancelou a abertura da pasta.");
        }
    },

    async loadFile(fileHandle) {
        const file = await fileHandle.getFile();
        const content = await file.text();
        
        // Atualiza o editor local
        EditorModule.instance.setValue(content);
        EditorModule.setLanguage(fileHandle.name);
        
        const nameDisplay = document.getElementById('active-filename');
        if (nameDisplay) nameDisplay.innerText = fileHandle.name;

        // ENVIA PARA O CLIENT: Avisa que um arquivo novo foi aberto
        P2PModule.send({
            type: 'FILE',
            name: fileHandle.name,
            content: content
        });
    }
};
