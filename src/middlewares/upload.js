// src/middlewares/upload.js
import multer from 'multer';

const storage = multer.memoryStorage(); // файли зберігаються в пам'яті
export const upload = multer({ storage });
