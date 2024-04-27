import axios from 'axios';

export default async (_, res, path) => {
    try {
        let request = await axios.get(`https://math.international/${path}`, { responseType: 'arraybuffer' });
        res.header('Content-Type', request.headers['content-type']);
        res.send(Buffer.from(request.data, 'binary'));
    } catch (e) {
        console.error(e, path);
    };
};