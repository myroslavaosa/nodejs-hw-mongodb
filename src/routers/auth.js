// src/routers/auth.js

import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema } from '../validation/auth.js';
import { registerUserController, refreshUserController, logoutController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.post(
    '/register',
    validateBody(registerUserSchema),
    ctrlWrapper(registerUserController),
);

router.post(
    '/refresh',
    ctrlWrapper(refreshUserController),
);

router.post('/logout', ctrlWrapper(logoutController),);



export default router;
