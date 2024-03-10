export default (app) => app.get(`/*`, async (req, res) => {
    let path = req.url.split('?')[0];

    if ([
        'models/Linear_Gradient_Texture.jpg'
    ].some(p => path.includes(p))) return res.status(404);

    let pathManagers = [
        [['/'], 'homepage', true],
        [['shellshock.js'], 'script', true],

        [['.png', '.jpg', '.jpeg', '.svg', '.webm', '.ico', '.gif', '.lightmap'], 'buffer'],
        [['.js', '.json', '.css', '.babylon.manifest', '.babylon'], 'raw']
    ];

    let file = pathManagers.find(s => s[0].some(p => path[s[2] ? 'endsWith' : 'includes'](p)))?.[1];
    if (!file) return console.log(`[ERROR] "${path}" was fetched, but there wasn't a ready handler.`);

    await (await import(`#proxy/routes/${file}`)).default(req, res, path);
});