import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

import game from './game/rewrite';
import files from './game/files';

import config from '../config';

const staticRoutes = {
    '/$': [fs.createReadStream(path.join(import.meta.dirname, './console/index.html')), 'text/html'],
    '/$/': [fs.createReadStream(path.join(import.meta.dirname, './console/index.html')), 'text/html'],
    '/$/style.css': [fs.createReadStream(path.join(import.meta.dirname, './console/style.css')), 'application/css'],
    '/$/script.js': [fs.createReadStream(path.join(import.meta.dirname, './console/script.js')), 'application/javascript'],
    '/$/ping': ['OK', 'text/plain']
} as { [key: string]: [Buffer | fs.ReadStream | string, string] };

http.createServer(async (req, res) => {
    const url = new URL(req.url!, `http://localhost`);
    const path = decodeURIComponent(url.pathname);

    const staticHandler = path in staticRoutes ? staticRoutes[path] : null;
    if (staticHandler) {
        res.writeHead(200, { 'Content-Type': staticHandler[1] });
        res.end(staticHandler[0]);
        return;
    }

    if (path.startsWith('/$')) {
        res.writeHead(200);
        res.end();
        return;
    }

    if (path.startsWith('/?') || path === '/') {
        const result = await game({ url });
        if (result[0] === 302) return res.writeHead(302, { Location: result[1] }).end();
        res.writeHead(200, { 'Content-Type': result[1] });
        res.end(result[0]);
        return;
    }

    const result = await files({ path });
    if (result[0] === 302) return res.writeHead(302, { Location: result[1] }).end();
    res.writeHead(200, { 'Content-Type': result[1] });
    res.end(result[0]);
    return;
}).listen(config.port);

console.log('$ cs @ http://localhost:' + config.port);