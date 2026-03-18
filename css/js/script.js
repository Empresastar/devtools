// O objetivo é fazer o botão mudar de cor, mas tem um erro aqui!
const botao = document.querySelector("button");

botao.addEventListener("click", () => {
    // BUG: A variável 'corRubi' não foi definida! 
    // Tentem definir ela juntos para o código parar de dar erro no console.
    botao.style.backgroundColor = corRubi; 
    console.log("Tentando mudar a cor...");
});
