import axios from 'axios';
import config from '#config';

export default async (app) => await app.get('/mod/proxy/:url', async (req, res) => {
    let url = decodeURIComponent(req.params.url);
    if (!config.cacheable.some(r => url.startsWith(r)) && !config.cacheable.includes('*')) return res.send('');

    axios.get(url).then((resp) => {
        res.setHeader('content-type', 'text/css');
        res.send(resp.data);
    }).catch(() => res.send(''));
});