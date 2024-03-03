import axios from 'axios';

export default async (req, res, path) => {
    try {
        let request = await axios.get(`https://math.international/${path}`, {
            responseType: 'arraybuffer' // special format for media
        });

        const pathData = { // mime types to prevent odd behavior
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            svg: 'image/svg+xml',
            webm: 'video/webm',
            ico: 'image/x-icon',
            gif: 'image/gif'
        };

        const imageBuffer = Buffer.from(request.data, 'binary'); // parse special format

        res.header('Content-Type', pathData[path.split('.')[path.split('.').length - 1]]); // use mime type
        res.send(imageBuffer);
    } catch (e) {
        console.error(e, path);
    };
};