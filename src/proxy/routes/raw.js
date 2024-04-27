import axios from 'axios';

export default async (_, res, path) => {
    try {
        if (path === '/js/shellshock.og.js') path = '/js/shellshock.js';

        let request = await axios.get(`https://math.international/${path}`);
        res.header('Content-Type', request.headers['content-type']);
        res.send(request.data);
    } catch (e) {
        console.error(e, path);
    };
};