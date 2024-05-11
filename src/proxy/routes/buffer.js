import axios from 'axios';
import config from '#config';

export default async (_, res, path) => {
    try {
        let request = await axios.get(`https://${config.fileHost}${path}`, {
            responseType: 'arraybuffer',
            headers: { Authorization: `Basic ${config.authorization}` },
            validateStatus: false
        });

        res.header('Content-Type', request.headers['content-type']);
        res.send(Buffer.from(request.data, 'binary'));
    } catch (e) {
        console.error(e, path);
    };
};