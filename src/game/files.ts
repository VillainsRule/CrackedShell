import patches from './patches';

import cache from '../util/cache';
import { redirect, send } from '../util/respond';

export default async ({ path }) => {
    const mime = Bun.file(path).type.split(';')[0] || 'application/octet-stream';

    if (cache.has(path)) {
        const cachedData = Buffer.from(cache.get(path) || '', 'base64');
        return send(cachedData, mime + '; charset=UTF-8');
    }

    const response = await fetch('https://shellshock.io' + ((path === '/js/shellshock.og.js') ? '/js/shellshock.js' : path));
    if (response.status !== 200) return redirect('/$');

    let arrayBuffer = await response.arrayBuffer();
    let data = Buffer.from(arrayBuffer);

    if (patches[path]) {
        let dataString = data.toString();

        for (const patch of patches[path]) {
            if (patch.find instanceof RegExp) dataString = dataString.replace(patch.find, patch.replace);
            else dataString = dataString.replaceAll(patch.find, patch.replace);
        }

        data = Buffer.from(dataString);
    }

    cache.set(path, data.toString('base64'));
    return send(data, mime + '; charset=UTF-8');
}