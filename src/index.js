// src/index.js
import dotenv from 'dotenv';
dotenv.config(); // <-- load .env first

import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const bootstrap = async () => {
    await initMongoConnection();
    setupServer();
};

bootstrap();

