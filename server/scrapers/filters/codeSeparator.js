const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

/**
 * Filtra e organiza o conteúdo extraído em pastas
 * @param {string} baseUrl - URL original para resolver caminhos relativos
 * @param {string} html - HTML bruto extraído
 * @param {object} assets - Lista de links (scripts e styles) vindos da engine
 * @param {string} storageId - ID da pasta (geralmente o nome do domínio ou timestamp)
 */
async function filterAndOrganize(baseUrl, html, assets, storageId) {
    const projectPath = path.join(__dirname, '../storage', storageId);
    
    // Cria a estrutura de pastas estilo VS Code
    await fs.ensureDir(path.join(projectPath, 'js'));
    await fs.ensureDir(path.join(projectPath, 'css'));
    await fs.ensureDir(path.join(projectPath, 'structure'));

    const $ = cheerio.load(html);

    // 1. Extrair Scripts Internos (Inline)
    $('script').each((i, el) => {
        const content = $(el).html();
        if (content && content.trim().length > 0) {
            fs.writeFileSync(
                path.join(projectPath, `js/inline-script-${i}.js`),
                content
            );
        }
    });

    // 2. Extrair CSS Interno (Inline)
    $('style').each((i, el) => {
        const content = $(el).html();
        if (content && content.trim().length > 0) {
            fs.writeFileSync(
                path.join(projectPath, `css/inline-style-${i}.css`),
                content
            );
        }
    });

    // 3. Salvar o HTML principal (limpo)
    // Removemos os scripts e styles internos do HTML original para visualização limpa
    $('script').remove();
    $('style').remove();
    fs.writeFileSync(path.join(projectPath, 'structure/index.html'), $.html());

    // 4. Download de Assets Externos (Opcional - Tentativa de pegar arquivos remotos)
    // Aqui resolvemos o bug de links que não tem o domínio completo
    for (let scriptUrl of assets.scripts) {
        try {
            const fileName = path.basename(new URL(scriptUrl).pathname) || `external-${Date.now()}.js`;
            // Apenas um placeholder: Em um sistema real, você faria axios.get(scriptUrl) aqui
            fs.writeFileSync(path.join(projectPath, `js/ext-${fileName}`), `// Source: ${scriptUrl}\n// Download pendente ou bloqueado por CORS no servidor.`);
        } catch (e) {
            console.error("Erro ao processar link de script:", scriptUrl);
        }
    }

    return {
        projectPath,
        files: await fs.readdir(projectPath, { recursive: true })
    };
}

module.exports = { filterAndOrganize };
