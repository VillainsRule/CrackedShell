import config from '../../config';

export default async ({ url }: { url: URL }): Promise<[Buffer | string, string] | [302, string]>  => {
    const getter = await fetch('https://shellshock.io/');
    if (getter.status !== 200) return [302, '/$'];

    const response = await getter.text();

    type Payload = {
        js: string | string[];
        css: string | string[];
        instance: string | undefined;
    };

    let payload: Payload;

    try {
        payload = JSON.parse(url.searchParams.get('payload') || '{}');

        if (typeof payload.js === 'string') payload.js = [...JSON.parse(payload.js)];
        else payload.js = [];

        if (typeof payload.css === 'string') payload.css = [...JSON.parse(payload.css)];
        else payload.css = [];

        if (typeof payload.instance === 'string') payload.instance = payload.instance;
        else payload.instance = 'risenegg.com';
    } catch {
        return [302, '/$'];
    }

    let script = '';

    await Promise.all(payload.js.map(async (source) => {
        let text = '';

        try {
            let allowed = config.fetchable.includes('*') || config.fetchable.some(r => new URL(source).host === r);
            if (!allowed) return;

            let raw = await fetch(source, { headers: { 'User-Agent': 'CrackedShell/3.0' } });
            if (raw.status >= 400) return;

            text = await raw.text();
        } catch { }

        let regex = /\/\/\s(@\w+)\s+([^\n]+)/g;
        let lastIndex = 0;
        let metadata: Record<string, string[]> = {};
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

            dependencies += `;(() => {${await fetch(dep, { headers: { 'User-Agent': 'CrackedShell/3.0' } }).then((dep) => dep.text())}\n})();\n\n`;
        };

        return script += `;(() => {${dependencies};${text}\n})();\n\n`;
    }));

    let html = '';

    await Promise.all(payload.css.map(async (style) => {
        try {
            let allowed = config.fetchable.includes('*') || config.fetchable.some(r => new URL(style).host === r);
            if (!allowed) return;

            let raw = await fetch(style, { headers: { 'User-Agent': 'CrackedShell/3.0' } });
            if (raw.status >= 400) return;

            html += `<style>${await raw.text()}</style>`;
        } catch { }
    }));

    return [`
        <script>window.$INSTANCE=globalThis.$INSTANCE=$INSTANCE=window.opener?.$INSTANCE || localStorage.getItem('instance') || 'risenegg.com';</script>
        <script>(() => {${script.replace(/\$/g, '$$$$')}\n})();\n</script>
        <script>(() => {
            const originalWebSocket = window.WebSocket;

            window.WebSocket = function (url, protocols) {            
                if (typeof url === "string") {
                    url = url.replace(location.host, "${payload.instance}");
                    const baseDomain = location.hostname.split('.').slice(-2).join('.');
                    url = url.replace(baseDomain, "${payload.instance}");
                };

                return protocols ? new originalWebSocket(url, protocols) : new originalWebSocket(url);
            };

            window.WebSocket.prototype = originalWebSocket.prototype;
            window.WebSocket.CONNECTING = originalWebSocket.CONNECTING;
            window.WebSocket.OPEN = originalWebSocket.OPEN;
            window.WebSocket.CLOSING = originalWebSocket.CLOSING;
            window.WebSocket.CLOSED = originalWebSocket.CLOSED;
        })();</script>
        ${html}
        ${response}
    `, 'text/html; charset=UTF-8'];
}
