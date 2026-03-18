async function scanURL(url) {
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

        doc.querySelectorAll('link[rel="stylesheet"]').forEach((l, i) => {
            vfs.css[`style_${i+1}.css`] = { lang: 'css', content: `/* CSS de: ${l.href} */` };
        });

        doc.querySelectorAll('script[src]').forEach((s, i) => {
            vfs.js[`script_${i+1}.js`] = { lang: 'javascript', content: `// Script de: ${s.src}` };
        });

        return vfs;
    } catch (e) {
        alert("Erro no Scan!");
        return null;
    }
}
