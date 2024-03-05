import axios from 'axios';
import cache from '#cache';
import config from '#config';

export default async (req, res) => {
    try {
        let params = new URLSearchParams(req.url.replace('/', '')); // get the _cracked parameter
        if (params.size === 0) return res.redirect('/mod'); // redirect to config page if not found

        let injection = `
            ['transitions', 'forms', 'style', 'game'].forEach(async (stylesheet) => {
                let st = await fetch(\`/styles/\${stylesheet}.css\`);
                st = await st.text();
                document.head.appendChild(document.createElement('style')).innerHTML = st;
            });
        `; // manual style injection, see readme for more info

        let extraInjects = `
            let unsafeWindow = window;
            let GM_getValue = (...a) => localStorage.getItem(...a);
            let GM_setValue = (...a) => unsafeWindow.localStorage.setItem(...a);
            let GM_deleteValue = (...a) => localStorage.removeItem(...a);
            let GM_listValues = () => localStorage;
            let GM_setClipboard = (text, _, callback) => navigator.clipboard.writeText(text).then(() => callback());

            let isCrackedShell = true;
        `; // functions to replace tampermonkey & other utils, see readme

        let cracked = JSON.parse(atob(params.get('_cracked'))); // get parsed cracked data

        await Promise.all(cracked.scripts.map(async (s) => { // loop through all injecting scripts
            if (!config.cache.allowed.some(r => s.startsWith(r))) return; // ignore if not cache allowed
            // ^^ no handler because there's an error in modpage/download.js

            let sc;

            if (!cache.has(s)) { // freshly get
                sc = (await axios.get(s)).data;
                cache.set(s, sc);
            } else sc = cache.get(s); // use cache

            let crackedmeta = sc.split('// {{CRACKEDSHELL}}')?.[1]?.split('// {{!CRACKEDSHELL}}')?.[0]; // find meta for required scripts
            if (!crackedmeta) return injection += `;(() => {${extraInjects};${sc}})();`; // if no meta

            let preInject = '';
            let requires = crackedmeta.split('\n').filter(s => s.startsWith('// require:')).map(s => s.match(/"(.*?)"/)); // parse required scripts

            await Promise.all(requires.map(async (r) => { // loop through all required, fetch, add to code
                if (!config.cache.allowed.some(c => r[1].startsWith(c))) return resolve(); // cache allowed checker
                
                let script = await fetch(r[1]); // fetch
                script = await script.text();
                preInject += `(() => {${script}})();`; // add to code
            }));

            injection += `;(() => {${extraInjects};${preInject};${sc}})();`; // add all the code to a <script> element

            return; // finish promise
        }));

        let page = await axios.get(`https://math.international/`);

        page.data = page.data.replace(`</script>`, `</script><script>${injection}</script>`); // make the <script> element & add code

        res.send(page.data);
    } catch (e) {
        console.error(e, '/');
    };
};