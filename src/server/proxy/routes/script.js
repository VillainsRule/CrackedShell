import axios from 'axios';
import config from '#config';

export default async (req, res) => {
    try {
        let request = await axios.get(`https://math.international/js/shellshock.js`);

        let replacements = [
            { // matchmaker
                find: '||location.host,',
                replace: `||'${config.server.url}',`
            },
            { // services
                find: '${location.hostname}',
                replace: config.server.url
            },
            { // services
                find: 'dynamicContentRoot+',
                replace: `"${config.server.url}"+`
            },
            { // game
                find: 'window.location.hostname',
                replace: `"${config.server.url}"`
            },
            {
                find: 'isHttps()',
                replace: !!config.server.secure ? 'true' : 'false',
                all: true
            }
        ];
        
        replacements.forEach((replacement) => {
            if (!replacement.condition?.() && !!replacement.condition) return;

            if (replacement.all) request.data = request.data.replaceAll(replacement.find, replacement.replace);
            else request.data = request.data.replace(replacement.find, replacement.replace);
        });

        res.header('Content-Type', request.headers['content-type']);
        res.send(request.data);
    } catch (e) {
        console.error(e, '/js/shellshock.js [special handler]');
    };
};