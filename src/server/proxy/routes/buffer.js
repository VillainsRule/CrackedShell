import axios from 'axios';

export default async (req, res, path) => {
    try {
        let request = await axios.get(`https://math.international/${path}`, {
            responseType: 'arraybuffer' // special format for media
        });

        const imageBuffer = Buffer.from(request.data, 'binary'); // parse special format

        res.header('Content-Type', request.headers['content-type']); // use mime type from the shell response
        res.send(imageBuffer);
    } catch (e) {
        console.error(e, path);
    };
};