import axios from 'axios';
import cache from '#cache';
import config from '#config';

export default async (req, res) => {
    try {
        let params = new URLSearchParams(req.url.replace('/', ''));
        if (params.size === 0) return res.redirect('/mod');

        let scriptTag = ``;
        let styleTags = ``;

        let extraInjects = `
            let unsafeWindow = window;
            let GM_deleteValue = (...a) => localStorage.removeItem(...a);
            let GM_listValues = () => localStorage;
            let GM_setClipboard = (text, _, callback) => navigator.clipboard.writeText(text).then(() => callback());

            let GM_setValue = (name, value) => {
                if (typeof value === 'object') localStorage.setItem(name, JSON.stringify(value));
                else localStorage.setItem(name, value);
            };

            let GM_getValue = (name) => {
                try {
                    return JSON.parse(localStorage.getItem(name));
                } catch {
                    localStorage.getItem(name);
                };
            };

            let isCrackedShell = true;
        `;

        let cracked = JSON.parse(atob(params.get('cs')));

        await Promise.all(cracked.map(async (url) => {
            if (!config.cacheable.some(r => url.startsWith(r)) && !config.cacheable.includes('*')) return;

            if (url.endsWith('.js')) {
                let raw;

                if (!cache.has(url)) {
                    raw = (await axios.get(url)).data;
                    cache.set(url, raw);
                } else raw = cache.get(url);

                let crackedmeta = raw.split('// {{CRACKEDSHELL}}')?.[1]?.split('// {{!CRACKEDSHELL}}')?.[0];
                if (!crackedmeta) return scriptTag += `;(() => {${extraInjects};${raw}})();`;

                let preInject = '';
                let requires = crackedmeta.split('\n').filter(s => s.startsWith('// require:')).map(s => s.match(/"(.*?)"/));

                await Promise.all(requires.map(async (r) => {
                    if (!config.cacheable.some(c => r[1].startsWith(c)) && !config.cacheable.includes('*')) return resolve();

                    let script = await fetch(r[1]);
                    script = await script.text();
                    preInject += `(() => {${script}})();`;
                }));

                scriptTag += `;(() => {${extraInjects};${preInject};${raw}})();`;
            } else styleTags += `<link rel="stylesheet" href="/mod/proxy/${encodeURIComponent(url)}" />`;

            return;
        }));

        let page = await axios.get(`https://math.international/`);

        page.data = page.data.replace(`</script>`, `</script><script>${scriptTag}</script>${styleTags}`);

        res.header('Content-Type', page.headers['content-type']);
        res.send(page.data);
    } catch (e) {
        console.error(e, '/');
    };
};