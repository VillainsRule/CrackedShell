import express from 'express';
import url from 'url';
import config from '#config';

import proxy from '#modpage/proxy';
import download from '#modpage/download';

export default async (app) => {
    await proxy(app);
    await download(app);

    await app.get('/mod/data', async (req, res) => {
        res.set('Access-Control-Allow-Origin', '*');

        res.send({
            success: true,
            cacheable: config.cacheable
        });
    });

    await app.use('/mod', express.static(url.fileURLToPath(new URL('.', import.meta.url)) + './static'));
};