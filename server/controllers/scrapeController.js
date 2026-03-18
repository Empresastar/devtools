const { extractFullContent } = require('../scrapers/engine');
const { filterAndOrganize } = require('../filters/codeSeparator');
const path = require('path');
const fs = require('fs-extra');

/**
 * Controller responsável por coordenar a extração e filtragem
 */
const handleScrape = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Uma URL válida é necessária.' });
    }

    try {
        // 1. Gerar um ID único para a pasta do projeto
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace(/\./g, '-');
        const storageId = `${domain}-${Date.now()}`;

        console.log(`[Controller] Iniciando extração de: ${url}`);

        // 2. Chamar a Engine (Passo 3)
        const extraction = await extractFullContent(url);

        if (!extraction.success) {
            throw new Error(extraction.error);
        }

        // 3. Chamar o Filtro (Passo 4)
        console.log(`[Controller] Filtrando e organizando arquivos...`);
        const organization = await filterAndOrganize(
            url, 
            extraction.html, 
            extraction.assets, 
            storageId
        );

        // 4. Retornar os dados para o Frontend
        res.status(200).json({
            success: true,
            message: 'Site extraído e filtrado com sucesso!',
            data: {
                id: storageId,
                title: extraction.title,
                files: organization.files, // Lista de caminhos para a árvore de arquivos
                baseUrl: url
            }
        });

    } catch (error) {
        console.error(`[Controller Error]:`, error.message);
        res.status(500).json({
            success: false,
            error: 'Falha ao processar a URL',
            details: error.message
        });
    }
};

/**
 * Controller para buscar o conteúdo de um arquivo específico para o editor
 */
const getFileContent = async (req, res) => {
    const { storageId, filePath } = req.query;

    try {
        const fullPath = path.join(__dirname, '../storage', storageId, filePath);
        
        // Verificação de segurança para evitar que acessem pastas fora do storage
        if (!fullPath.startsWith(path.join(__dirname, '../storage'))) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const content = await fs.readFile(fullPath, 'utf8');
        res.status(200).json({ content });
    } catch (error) {
        res.status(404).json({ error: 'Arquivo não encontrado' });
    }
};

module.exports = {
    handleScrape,
    getFileContent
};
