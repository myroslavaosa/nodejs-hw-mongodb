import path from 'path';
import cookieParser from 'cookie-parser';
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import router from './routers/index.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { SWAGGER_PATH } from './constants/index.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use(
        pino({
            transport: { target: 'pino-pretty' },
        }),
    );

    app.use(cookieParser());

    app.get('/', (req, res) => {
        res.json({ message: 'Hello World!' });
    });

    app.use(router);

    app.use(notFoundHandler);
    app.use(errorHandler);

    // Serve Swagger JSON statically (optional)
    app.use('/swagger-json', express.static(path.dirname(SWAGGER_PATH)));

    // Serve Swagger UI
    app.use('/api-docs', ...swaggerDocs());

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
