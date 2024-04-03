import axios from 'axios';
import replacements from './replacements.js';

export default async (req, res) => {
    try {
        let request = await axios.get(`https://math.international/js/shellshock.js`);

        replacements.forEach((replacement) => {
            if (!replacement.condition?.() && !!replacement.condition) return;

            if (replacement.all) request.data = request.data.replaceAll(replacement.find, replacement.replace);
            else request.data = request.data.replace(replacement.find, replacement.replace);
        });

        res.header('Content-Type', request.headers['content-type']);
        res.send(request.data);
    } catch (e) {
        console.error(e, 'shellshock.js [special]');
    };
};