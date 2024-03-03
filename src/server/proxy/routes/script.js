import axios from 'axios';

export default async (req, res) => {
    try {
        let request = await axios.get(`https://math.international/js/shellshock.js`); // fetch script

        let replacements = [ // a list of replacements used
            ['||location.host,', '||\'math.international\','], // replace /matchmaker/ socket
            ['${location.hostname}', 'math.international'], // replace /services/ socket
            ['dynamicContentRoot+', `"math.international"+`], // replace /services/ socket
            ['window.location.hostname', '"math.international"'], // replace /game/ socket
            ['isHttps()', 'true', true] // fix socket http issues
        ];

        replacements.forEach(s => request.data = request.data[s[2] ? 'replaceAll' : 'replace'](s[0], s[1])); // replace them

        res.send(request.data); // send response
    } catch (e) {
        console.error(e, '/js/shellshock.js [special handler]');
    };
};