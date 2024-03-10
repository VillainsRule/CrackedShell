import express from 'express';
import config from '#config';

import modPageHandler from '#modpage/handle';
import proxyHandler from '#proxy/handle';

(async () => {
    const app = express();

    app.use(express.json());

    await modPageHandler(app);
    await proxyHandler(app);

    app.listen(config.port, () => console.log(`CrackedShell is running! Try it at http://localhost:${config.port}`));
})();