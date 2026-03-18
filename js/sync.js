// No main.js, dentro da função que cria o editor, adicione:

window.editor.onDidChangeModelContent(() => {
    const conteudo = window.editor.getValue();
    
    // Se houver uma conexão ativa, envia o código para o amigo
    if (conn && conn.open) {
        conn.send(conteudo);
    }
});
