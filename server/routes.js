const express = require('express');
const router = express.Router();
const scrapeController = require('./controllers/scrapeController');

// Rota principal de extração
router.post('/extract', scrapeController.handleScrape);

// Rota para ler o conteúdo de um arquivo filtrado
router.get('/file-content', scrapeController.getFileContent);

module.exports = router;
