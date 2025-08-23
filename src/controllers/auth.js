// src/controllers/auth.js
import createHttpError from 'http-errors';
import { registerUser, createSession, refreshSession, logoutSession } from '../services/auth.js';

export const registerUserController = async (req, res) => {
    // 1. Create the user
    const user = await registerUser(req.body);

    // 2. Create access and refresh tokens for this user
    const { accessToken, refreshToken } = await createSession(user._id);

    // 3. Set the refresh token in a cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // set true if HTTPS
        sameSite: 'strict',
    });

    // 4. Send response with access token and user info
    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: { user, accessToken },
    });
};



export const refreshUserController = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw createHttpError(401, 'No refresh token provided');
    }

    const { accessToken, refreshToken: newRefreshToken } = await refreshSession(refreshToken);

    res
        .cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true, // увімкнути на https
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
