import fs from 'node:fs';
import path from 'node:path';

import { redirect, send } from '../util/respond';

import config from '../../config';

const core = fs.readFileSync(path.join(import.meta.dirname, '..', 'console', 'core.js'), 'utf-8');

export default async ({ url }) => {
    const getter = await fetch('https://shellshock.io/');
    if (getter.status !== 200) return redirect('/$');

    const response = await getter.text();

    type Payload = {
        js: string | string[];
        css: string | string[];
        instance: string | undefined;
    };

    let payload: Payload;

    try {
        payload = JSON.parse(url.searchParams.get('payload'));

        if (typeof payload.js === 'string') payload.js = ['core', ...JSON.parse(payload.js)];
        else payload.js = [];

        if (typeof payload.css === 'string') payload.css = [...JSON.parse(payload.css)];
        else payload.css = [];

        if (typeof payload.instance === 'string') payload.instance = payload.instance;
        else payload.instance = 'risenegg.com';
    } catch {
        return redirect('/$');
    }

    let script = '';

    await Promise.all(payload.js.map(async (source) => {
        let text = '';

        if (source != 'core') {
            try {
                let allowed = config.fetchable.includes('*') || config.fetchable.some(r => new URL(source).host === r);
                if (!allowed) return;

                let raw = await fetch(source);
                if (raw.status >= 400) return;

                text = await raw.text();
            } catch { }
        } else text = core;

        let regex = /\/\/\s(@\w+)\s+([^\n]+)/g;
        let lastIndex = 0;
        let metadata = {};
        let match: RegExpExecArray | null;

        while ((match = regex.exec(text)) !== null) {
            const key = match[1];
            const value = match[2].trim();

            if (!metadata[key]) metadata[key] = [];
            metadata[key].push(value);

            lastIndex = regex.lastIndex;
            if (lastIndex === match.index) regex.lastIndex++;
        }

        if (!metadata || !metadata['@require']) return script += `;(() => {${text}\n})();`;

        let dependencies = '';
        let deps = metadata['@require'];

        for (let i = 0; i < deps.length; i++) {
            let dep = typeof (deps[i]) == 'object' ? deps[i][1] : deps[i];
            if (!dep) continue;
            if (
                !config.fetchable.some(c => dep.startsWith('https://' + c)) &&
                !config.fetchable.includes('*')
            ) continue;

            dependencies += `;(() => {${await fetch(dep).then((dep) => dep.text())}\n})();\n\n`;
        };

        return script += `;(() => {${dependencies};${text}\n})();\n\n`;
    }));

    let html = '';

    await Promise.all(payload.css.map(async (style) => {
        try {
            let allowed = config.fetchable.includes('*') || config.fetchable.some(r => new URL(style).host === r);
            if (!allowed) return;

            let raw = await fetch(style);
            if (raw.status >= 400) return;

            html += `<style>${await raw.text()}</style>`;
        } catch { }
    }));

    return send(response.replace(`</script>`, `</script>
        <script>window.$WEBSOCKET=globalThis.$WEBSOCKET=$WEBSOCKET="${payload.instance}";</script>
        <script>window.$INSTANCE=globalThis.$INSTANCE=$INSTANCE=window.opener.$INSTANCE;</script>
        <script>(() => {${script.replace(/\$/g, '$$$$')}\n})();\n</script>${html}`),
        'text/html; charset=UTF-8');
}