const puppeteer = require('puppeteer');

/**
 * Função principal para extrair o conteúdo de uma URL
 * @param {string} url - A URL alvo enviada pelo usuário
 */
async function extractFullContent(url) {
    let browser;
    try {
        // Inicia o navegador (configurado para rodar bem em containers ou local)
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Define um User-Agent para evitar ser bloqueado por sites básicos
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // Configura o tempo de espera para 30 segundos e espera a rede ficar ociosa
        console.log(`--- Acessando: ${url} ---`);
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Extrai o HTML bruto renderizado
        const htmlContent = await page.content();

        // Extrai links de CSS e JS externos para o nosso filtro baixar depois
        const assets = await page.evaluate(() => {
            const sources = {
                scripts: [],
                styles: []
            };

            // Pega todos os <script src="...">
            document.querySelectorAll('script[src]').forEach(script => {
                sources.scripts.push(script.src);
            });

            // Pega todos os <link rel="stylesheet" href="...">
            document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                sources.styles.push(link.href);
            });

            return sources;
        });

        await browser.close();

        return {
            success: true,
            html: htmlContent,
            assets: assets,
            title: await page.title()
        };

    } catch (error) {
        if (browser) await browser.close();
        console.error(`Erro ao extrair ${url}:`, error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = { extractFullContent };
