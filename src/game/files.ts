import axios from 'axios';

import cache from '../util/cache';
import { redirect, send } from '../util/respond';

import patches from '../constants/patches';
import mimes from '../constants/mimes.json';

const contentTypeMap = {
    'image': 'binary',
    'audio': 'binary',
    'video': 'binary',
    'lightmap': 'binary',
    'gltf-binary': 'binary',
    'javascript': 'text',
    'text/': 'text'
};

export default async ({ path }) => {
    const extension = path.split('.').pop();
    const mime = mimes[extension] || 'text/html';
    const assumedType = Object.entries(contentTypeMap).find(([type]) => mime.includes(type)) || 'text';

    if (assumedType[1] === 'binary' && cache.has(path))
        return send(Buffer.from(cache.get(path) || '', 'base64'), mime);

    const fetchable = path === '/js/shellshock.og.js' ? '/js/shellshock.js' : path;

    const axiosResponse = await axios.get('https://shellshock.io' + fetchable, {
        responseType: 'arraybuffer',
        validateStatus: () => true
    });

    if (axiosResponse.status !== 200) return redirect('/$');

    if (patches[path]) for (const patch of patches[path]) {
        if (patch.global) axiosResponse.data = axiosResponse.data.toString().replaceAll(patch.find, patch.replace);
        else axiosResponse.data = axiosResponse.data.toString().replace(patch.find, patch.replace);
    }

    if (assumedType[1] === 'binary' || extension === 'glb') {
        const decoded = Buffer.from(axiosResponse.data, 'binary');
        cache.set(path, decoded.toString('base64'));
        return send(decoded, mime);
    } else return send(axiosResponse.data.toString(), mime);
}