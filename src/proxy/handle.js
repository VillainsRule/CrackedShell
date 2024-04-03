import fs from 'fs';
import paths from '#proxy/paths';

export default (app) => app.get(`/*`, async (req, res) => {
    let path = req.url.split('?')[0];

    if (fs.existsSync(`./replacements/${Buffer.from(path, 'binary').toString('base64')}`)) {
        res.header('Content-Type', req.headers['content-type']);
        return res.send(fs.readFileSync(`./replacements/${Buffer.from(path, 'binary').toString('base64')}`));
    };

    let file = paths.find((pathData) => pathData.match.test(path));
    if (!file) return;

    await (await import(`#proxy/routes/${file.handler}`)).default(req, res, path);
});