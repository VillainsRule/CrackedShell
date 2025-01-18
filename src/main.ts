import Bun from 'bun';
import path from 'node:path';

import game from './game/rewrite';
import files from './game/files';

import config from '../config';

const build = async (file: string) => {
    let data = Bun.file(path.join(import.meta.dirname, file));

    return new Response(await data.bytes(), {
        headers: { 'Content-Type': data.type }
    })
}

Bun.serve({
    port: config.port,

    static: {
        '/$': await build('./console/index.html'),
        '/$/': await build('./console/index.html'),

        '/$/style.css': await build('./console/style.css'),
        '/$/script.js': await build('./console/script.js'),

        '/$/ping': new Response('OK', { status: 200 })
    },

    fetch: async (request) => {
        const url = new URL(request.url);
        const path = decodeURIComponent(url.pathname);

        if (path.startsWith('/$')) return new Response();
        else if (path.startsWith('/?') || path === '/') return await game({ url });
        else return await files({ path });
    }
});

console.log('$ cs @ http://localhost:' + config.port);