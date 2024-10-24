import { redirect, send } from '../util/respond';

import config from '../../config';

export default async ({ url }) => {
    const getter = await fetch('https://shellshock.io/');
    if (getter.status !== 200) return redirect('/$');

    const response = await getter.text();

    type Payload = {
        js: string | string[];
        css: string | string[];
        instance: string | undefined;
    };

    let rawPayload = url.searchParams.get('payload');
    let payload: Payload;

    try {
        payload = JSON.parse(rawPayload);

        typeof payload.js === 'string' && (payload.js = JSON.parse(payload.js));
        typeof payload.css === 'string' && (payload.css = JSON.parse(payload.css));
        
        if (!payload.instance) payload.instance = 'risenegg.com';
    } catch {
        return redirect('/$');
    }

    let script = '';

    Array.isArray(payload.js) && await Promise.all(payload.js.map(async (source) => {
        let allowed: boolean;

        try {
            let mappedURL = new URL(source);
            allowed = config.fetchable.includes('*') || config.fetchable.some(r => mappedURL.host === r);
        } catch {
            allowed = false;
        }

        if (!allowed) return;

        const raw = await fetch(source).then((raw) => raw.text());

        const meta = raw.match(/\$META\$(.*?)\$EMETA\$/s);
        if (!meta) return script += `;(() => {${raw}\n})();`;

        const regex = /\/\/\s(@\w+)\s+([^\n]+)/g;
        let lastIndex = 0; //because either bun or typescript (i love incompatiblities with drop-in replacements)
        let metadata = {};
        let match;
    
        while ((match = regex.exec(raw)) !== null) {
            const key = match[1];
            const value = match[2].trim();
            if (!metadata[key]) { metadata[key] = []; };
            metadata[key].push(value);
            lastIndex = regex.lastIndex;
            if (lastIndex === match.index) {
                regex.lastIndex++;
            }
        }

        if ((!meta) || !(metadata && metadata["@require"])) return script += `;(() => {${raw}\n})();`;

        let dependencies = '';
        let deps = metadata["@require"] || meta[1].split('\n').filter((s: string) => s.includes('&import')).map((s: string) => s.match(/"(.*?)"/));

        for (let i = 0; i < deps.length; i++) {
            let dep = deps[i];
            if (!dep || !dep[1]) continue;
            if (
                !config.fetchable.some(c => dep[1].startsWith('https://' + c)) &&
                !config.fetchable.includes('*')
            ) continue;

            dependencies += `;(() => {${await fetch(dep[1]).then((dep) => dep.text())}})();`;
        };

        return script += `;(() => {${dependencies};${raw}\n})();`;
    }));

    let html = '';

    Array.isArray(payload.css) && await Promise.all(payload.css.map(async (style) => {
        let allowed: boolean;

        try {
            let mappedURL = new URL(style);
            allowed = config.fetchable.includes('*') || config.fetchable.some(r => mappedURL.host === r);
        } catch {
            allowed = false;
        };

        if (allowed) html += `<style>${await fetch(style).then((style) => style.text())}</style>`;
    }));

    return send(
        response.replace(`</script>`, `</script>
            <script>window.$WEBSOCKET=globalThis.$WEBSOCKET=$WEBSOCKET = "${payload.instance}";</script>
            <script>(() => {${script}\n})();\n</script>${html}`),
        getter.headers['content-type']
    );
}