import axios from 'axios';
import fs from 'fs';
import cache from '#cache';
import config from '#config';

let injection = fs.readFileSync('./src/proxy/routes/main/injection.js', 'utf-8');

export default async (req, res, path) => {
    try {
        let params = new URLSearchParams(req.url.replace('/', ''));
        if (params.size === 0) return res.redirect('/mod');

        let scriptTag = ``;
        let styleTags = ``;

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

                scriptTag += `;(() => {${preInject};${raw}})();`;
            } else styleTags += `<link rel="stylesheet" href="/mod/proxy/${encodeURIComponent(url)}" />`;

            return;
        }));

        let page = await axios.get(`https://math.international/`);

        page.data = page.data.replace(`</script>`, `</script><script>(() => {${injection};${scriptTag}})();</script>${styleTags}`);

        res.header('Content-Type', page.headers['content-type']);
        res.send(page.data);
    } catch (e) {
        console.error(e, path);
    };
};