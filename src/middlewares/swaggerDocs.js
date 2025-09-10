import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';
import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
    let swaggerDoc;

    try {
        swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH, 'utf-8'));
    } catch (err) {
        return (req, res, next) =>
            next(createHttpError(500, "Can't load swagger docs", { cause: err }));
    }

    // Return middleware array for Express
    return [swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
};
