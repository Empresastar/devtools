async function scanURL(url) {
    // Proxy para evitar bloqueio de segurança
    const proxy = "https://api.allorigins.win/get?url=";
    try {
        const response = await fetch(proxy + encodeURIComponent(url));
        const data = await response.json();
        const html = data.contents;

        const vfs = {
            'index.html': { lang: 'html', content: html },
            'css': {},
            'js': {}
        };

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Pega os arquivos de estilo
        doc.querySelectorAll('link[rel="stylesheet"]').forEach((l, i) => {
            const fileName = `11. style_${i+1}.css`;
            vfs.css[fileName] = { lang: 'css', content: `/* Origem: ${l.href} */\n/* O código CSS apareceria aqui */` };
        });

        // Pega os arquivos de script
        doc.querySelectorAll('script[src]').forEach((s, i) => {
            const fileName = `12. script_${i+1}.js`;
            vfs.js[fileName] = { lang: 'javascript', content: `// Origem: ${s.src}\n// O código JS apareceria aqui` };
        });

        return vfs;
    } catch (e) {
        alert("Erro ao acessar o site. Verifique a URL.");
        return null;
    }
}
