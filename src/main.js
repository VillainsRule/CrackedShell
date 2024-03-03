import express from 'express';
import config from '#config';

// import handlers from other files
import modPageHandler from '#modpage/handle';
import proxyHandler from '#proxy/handle';

(async () => {
    const app = express();

    // allow use of body jsons in fetch requests
    app.use(express.json());

    // run handlers
    // mod page comes first due to /* route
    await modPageHandler(app);
    await proxyHandler(app);

    app.listen(config.port, () => console.log(`CrackedShell is running! Try it at http://localhost:${config.port}`));
})();