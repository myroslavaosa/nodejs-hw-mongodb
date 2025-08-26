// src/routers/auth.js

import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema } from '../validation/auth.js';
import { registerUserController, refreshUserController, logoutController, loginUserController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema } from '../validation/authSchemas.js';

const router = Router();

router.post(
    '/register',
    validateBody(registerUserSchema),
    ctrlWrapper(registerUserController),
);

router.post('/login', validateBody(loginUserSchema), loginUserController); // ✅ новий роут

router.post(
    '/refresh',
    ctrlWrapper(refreshUserController),
);

router.post('/logout', ctrlWrapper(logoutController),);



export default router;
