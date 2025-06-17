// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { gettingContacts, gettingContactId } from './services/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            },
        }),
    );

    app.get('/', (req, res) => {
        res.json({
            message: 'Hello World!',
        });
    });



    app.get('/contacts', async (req, res, next) => {
        try {
            const result = await gettingContacts();
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    });

    app.get('/contacts/:contactId', async (req, res, next) => {
        try {
            const result = await gettingContactId(req.params.contactId);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    });

    app.use((req, res) => {
        res.status(404).json({
            message: 'Not found',
        });
    });

    app.use((err, req, res, next) => {
        res.status(500).json({
            message: 'Something went wrong',
            error: err.message,
        });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
