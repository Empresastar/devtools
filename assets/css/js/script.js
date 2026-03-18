const btn = document.getElementById('btn-acao');
const statusText = document.getElementById('status');

btn.addEventListener('click', () => {
    statusText.innerText = "O script funcionou e as pastas estão certas! ✅";
    statusText.style.color = "#00ff88";
});
