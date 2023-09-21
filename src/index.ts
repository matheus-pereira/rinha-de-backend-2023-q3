import express from 'express';
import bodyParser from 'body-parser';
import { createRouter } from './router';
import { start as startRepository } from './repository';

const startServer = async () => {
    await startRepository();

    const app = express();
    app.use(bodyParser.json());
    app.use(createRouter());

    app.listen(3000, () => {
        console.info('Server listening on port http://localhost:3000');
    });
}

startServer();
