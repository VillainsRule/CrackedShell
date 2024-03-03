import axios from 'axios';

export default async (req, res, path) => {
    try {
        let request = await axios.get(`https://math.international/${path}`); // get & send raw data. simple.
        res.send(request.data);
    } catch (e) {
        console.error(e, path);
    };
};