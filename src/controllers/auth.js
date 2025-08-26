// src/controllers/auth.js
import createHttpError from 'http-errors';
import { registerUser, createSession, refreshSession, logoutSession, loginUser, logoutSessionsByUserId } from '../services/auth.js';

export const registerUserController = async (req, res) => {
    const user = await registerUser(req.body);

    await logoutSessionsByUserId(user._id); // remove old sessions first

    const { accessToken, refreshToken } = await createSession(user._id);
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
    });

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: { user, accessToken },
    });
};

export const refreshUserController = async (req, res) => {
    const refreshToken =
        req.cookies?.refreshToken ||
        req.headers['authorization']?.replace('Bearer ', '');

    if (!refreshToken) {
        throw createHttpError(401, 'No refresh token provided');
    }

    const { accessToken, refreshToken: newRefreshToken } = await refreshSession(refreshToken);
    const isProduction = process.env.NODE_ENV === 'production';

    res
        .cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: isProduction, // увімкнути на https
            sameSite: 'strict',
        })
        .status(200)
        .json({
            status: 200,
            message: 'Successfully refreshed a session!',
            data: { accessToken },
        });
};

export const logoutController = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        throw createHttpError(401, 'No refresh token provided');
    }

    await logoutSession(refreshToken);

    // Cookie löschen
    res.clearCookie('refreshToken');
    res.status(204).end();
};

export const loginUserController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { accessToken, refreshToken } = await loginUser(email, password);

        const isProduction = process.env.NODE_ENV === 'production';

        // Записати refreshToken у cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction, // true на https
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
        });

        res.status(200).json({
            status: 200,
            message: 'Successfully logged in an user!',
            data: { accessToken },
        });
    } catch (err) {
        next(err);
    }
};
