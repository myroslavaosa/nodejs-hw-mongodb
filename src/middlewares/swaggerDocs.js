import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
    try {
        const swaggerDoc = YAML.load(SWAGGER_PATH);
        return [swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
    } catch (err) {
        return [
            (req, res, next) => {
                console.error("Can't load swagger docs:", err);
                res.status(500).json({ message: "Can't load swagger docs" });
            }
        ];
    }
};
