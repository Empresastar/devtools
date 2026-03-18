// Teste de conexão do script
console.log("💎 Projeto Rubi: Script carregado com sucesso!");

const botao = document.getElementById('btnInteragir');
const titulo = document.getElementById('titulo');

botao.addEventListener('click', () => {
    // Altera o título quando clicado
    titulo.style.color = '#00ffcc'; 
    titulo.innerText = "🚀 Código Sincronizado!";
    
    alert("Boa! A interação funcionou no Projeto Rubi.");
    
    // Volta ao normal depois de 2 segundos
    setTimeout(() => {
        titulo.style.color = '#e0115f';
        titulo.innerText = "💎 Projeto Rubi";
    }, 2000);
});
