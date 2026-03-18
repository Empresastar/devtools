async function scanURL(url) {
    console.log("Iniciando scan em: " + url);
    const proxy = "https://api.allorigins.win/get?url=";
    
    try {
        const response = await fetch(proxy + encodeURIComponent(url));
        if (!response.ok) throw new Error("Não foi possível acessar a URL.");
        
        const data = await response.json();
        const htmlContent = data.contents;

        // Criando a estrutura virtual (VFS)
        const vfs = {
            'index.html': { lang: 'html', content: htmlContent },
            'css': {},
            'js': {}
        };

        // Parser para achar CSS e JS
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // Buscar CSS
        const links = doc.querySelectorAll('link[rel="stylesheet"]');
        links.forEach((link, index) => {
            const href = link.getAttribute('href');
            if (href) {
                const fileName = `style_${index + 1}.css`;
                vfs['css'][fileName] = { lang: 'css', content: `/* Conteúdo extraído de: ${href} */\n/* O sistema está processando o estilo... */` };
            }
        });

        // Buscar JS
        const scripts = doc.querySelectorAll('script[src]');
        scripts.forEach((script, index) => {
            const src = script.getAttribute('src');
            if (src) {
                const fileName = `script_${index + 1}.js`;
                vfs['js'][fileName] = { lang: 'javascript', content: `// Conteúdo extraído de: ${src}\nconsole.log('Script carregado via scanner');` };
            }
        });

        return vfs;
    } catch (error) {
        alert("Erro ao escanear: " + error.message);
        return null;
    }
}
