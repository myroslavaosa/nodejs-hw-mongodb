import swaggerUI from 'swagger-ui-express';
import SwaggerParser from '@apidevtools/swagger-parser';
import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
    let swaggerDoc;

    return [
        swaggerUI.serve,
        async (req, res, next) => {
            try {
                if (!swaggerDoc) {
                    swaggerDoc = await SwaggerParser.bundle(SWAGGER_PATH);
                }
                swaggerUI.setup(swaggerDoc)(req, res, next);
            } catch (err) {
                console.error("Swagger load error:", err);
                res.status(500).json({ message: "Can't load swagger docs" });
            }
        }
    ];
};

