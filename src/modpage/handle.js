import express from 'express';
import url from 'url';
import config from '#config';

import proxy from '#modpage/proxy';
import download from '#modpage/download';

export default async (app) => {
    await proxy(app);
    await download(app);

    await app.get('/mod/data', async (req, res) => res.send({
        cacheable: config.cacheable
    }));

    await app.get('/mod/active', async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.send({ active: true });
    });

    await app.use('/mod', express.static(url.fileURLToPath(new URL('.', import.meta.url)) + './static'));
};
