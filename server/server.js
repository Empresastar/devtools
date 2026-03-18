const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs-extra');

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Permite que o seu frontend (Porta 3000) acesse o backend
app.use(express.json()); // Permite receber JSON no corpo da requisição

// Garantir que a pasta de armazenamento exista
const storagePath = path.join(__dirname, 'storage');
fs.ensureDirSync(storagePath);

// Rota de Teste (Health Check)
app.get('/', (req, res) => {
    res.send('API do Web Extractor Rodando 🚀');
});

// Importação das Rotas (Vamos criar nos próximos passos)
// Aqui o código apenas prepara o terreno para os Controllers
const scrapeRoutes = require('./routes'); 
app.use('/api', scrapeRoutes);

// Servir arquivos estáticos da pasta storage (Para o editor ler os códigos extraídos)
app.use('/files', express.app.static(storagePath));

// Tratamento de erros básico (Resolvendo possíveis bugs de travamento)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Algo deu errado no servidor!' });
});

app.listen(PORT, () => {
    console.log(`---`);
    console.log(`✅ Servidor iniciado na porta ${PORT}`);
    console.log(`📂 Armazenamento em: ${storagePath}`);
    console.log(`---`);
});

module.exports = app; // Exportado para facilitar testes futuros
