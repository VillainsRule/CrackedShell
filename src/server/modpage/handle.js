import express from 'express';
import url from 'url';
import cache from '#cache';

import download from '#modpage/download';

export default async (app) => {
    await download(app); // use download.js

    await app.get('/mod/get/', async (req, res) => { // get cached script
        if (cache.has(req.query.url)) res.send(cache.get(req.query.url));
        else res.send('alert(`Script not found.`);');
    });

    await app.use('/mod', express.static(url.fileURLToPath(new URL('.', import.meta.url)) + './static')); // serve the static files

    return;
};