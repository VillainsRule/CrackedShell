import mime from 'mime/lite';

import cache from '../util/cache';

export default async ({ path }: { path: string }): Promise<[Buffer | string, string] | [302, string]> => {
    const foundMime = mime.getType(path) || 'application/octet-stream';
    const finalMime = foundMime === 'application/wasm' ? 'application/wasm' : foundMime + '; charset=UTF-8';

    if (cache.has(path)) {
        const cachedData = Buffer.from(cache.get(path) || '', 'base64');
        return [cachedData, finalMime];
    }

    const response = await fetch('https://shellshock.io' + ((path === '/js/shellshock.og.js') ? '/js/shellshock.js' : path));
    if (response.status !== 200) [302, '/$'];

    let arrayBuffer = await response.arrayBuffer();
    let data = Buffer.from(arrayBuffer);

    cache.set(path, data.toString('base64'));
    return [data, finalMime];
}