import fs from 'fs';

export default (app) => app.get(`/*`, async (req, res) => {
    let path = req.url.split('?')[0];

    if ([
        'models/Linear_Gradient_Texture.jpg'
    ].some(p => path.includes(p))) return res.status(404);

    let pathManagers = [
        [['/'], 'homepage', true],
        [['shellshock.js'], 'script'],

        [['.png', '.jpg', '.jpeg', '.svg', '.webm', '.ico', '.gif', '.lightmap'], 'buffer'],
        [['.js', '.json', '.css', '.babylon.manifest', '.babylon'], 'raw']
    ];

    if (fs.existsSync(`./replacements/${Buffer.from(path, 'binary').toString('base64')}`)) {
        res.header('Content-Type', req.headers['content-type']);
        return res.send(fs.readFileSync(`./replacements/${Buffer.from(path, 'binary').toString('base64')}`));
    };

    let file = pathManagers.find(s => s[0].some(p => s[2] ? path === p : path.includes(p)))?.[1];
    if (!file) return console.log(`[ERROR] "${path}" was fetched, but there wasn't a ready handler.`);

    await (await import(`#proxy/routes/${file}`)).default(req, res, path);
});