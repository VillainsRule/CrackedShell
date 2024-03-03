export default (app) => app.get(`/*`, async (req, res) => {
    let path = req.url.split('?')[0]; // a quick path variable, used a ton

    if ([ // prevent crashing with stupid bwd mistakes
        'models/Linear_Gradient_Texture.jpg'
    ].some(p => path.includes(p))) return res.status(404);

    let pathManagers = [ // special ways to handle different files/file types
        [['/'], 'homepage', true], // special homepage handler
        [['.png', '.jpg', '.jpeg', '.svg', '.webm', '.ico', '.gif', '.lightmap'], 'buffer'], // using buffers for media
        [['shellshock.js'], 'script', true], // using special shellshock.js injector
        [['.js', '.json', '.css', '.babylon.manifest', '.babylon'], 'raw'] // raw data
    ];

    let file = pathManagers.find(s => s[0].some(p => path[s[2] ? 'endsWith' : 'includes'](p)))?.[1]; // find path
    if (!file) return console.log(`[ERROR] "${path}" was fetched, but there wasn't a ready handler.`);

    await (await import(`#proxy/routes/${file}`)).default(req, res, path); // execute path
});