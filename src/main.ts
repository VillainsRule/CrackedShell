import Bun from 'bun';

import server from './console/server';
import game from './game/rewrite';
import files from './game/files';

import config from '../config';

Bun.serve({
    port: config.port,

    fetch: async (request) => {
        const url = new URL(request.url);
        const path = decodeURIComponent(url.pathname);

        if (path.startsWith('/$')) return server({ path });
        else if (path.startsWith('/?') || path === '/') return await game({ url });
        else return await files({ path });
    }
});

console.log('$ cs @ http://localhost:' + config.port);