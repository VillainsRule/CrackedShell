import axios from 'axios';

export default async (req, res) => {
    try {
        let request = await axios.get(`https://math.international/js/shellshock.js`);

        let replacements = [
            ['||location.host,', '||\'risenegg.com\','], // replace /matchmaker/ socket
            ['${location.hostname}', 'risenegg.com'], // replace /services/ socket
            ['dynamicContentRoot+', `"risenegg.com"+`], // replace /services/ socket
            ['window.location.hostname', '"risenegg.com"'], // replace /game/ socket
            ['isHttps()', 'true', true]
        ];

        replacements.forEach(s => request.data = request.data[s[2] ? 'replaceAll' : 'replace'](s[0], s[1]));

        res.header('Content-Type', request.headers['content-type']);
        res.send(request.data);
    } catch (e) {
        console.error(e, '/js/shellshock.js [special handler]');
    };
};