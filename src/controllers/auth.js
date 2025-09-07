import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { registerUser, createSession, refreshSession, logoutSession, loginUser, logoutSessionsByUserId } from '../services/auth.js';
import { UsersCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { sendEmail } from '../utils/sendMail.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const registerUserController = async (req, res) => {
    const user = await registerUser(req.body);

    await logoutSessionsByUserId(user._id);

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
            secure: isProduction,
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

    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
    });
    res.status(204).end();
};

export const loginUserController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken } = await loginUser(email, password);

        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: 200,
            message: 'Successfully logged in a user!',
            data: { accessToken },
        });
    } catch (err) {
        next(err);
    }
};

// --- POST /auth/send-reset-email
export const sendResetEmailController = async (req, res) => {
    const { email } = req.body;

    const user = await UsersCollection.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found!');
    }

    const token = jwt.sign(
        { sub: String(user._id), email },
        getEnvVar('JWT_SECRET'),
        { expiresIn: '5m' }
    );

    const appDomain = getEnvVar('APP_DOMAIN');
    const resetLink = `${appDomain}/reset-password?token=${token}`;

    try {
        await sendEmail({
            from: getEnvVar('SMTP_FROM'),
            to: email,
            subject: 'Password Reset',
            text: `Click the link to reset your password: ${resetLink}`,
            html: `<p>Click the link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
        });

        res.status(200).json({
            status: 200,
            message: 'Reset password email has been successfully sent.',
            data: {},
        });
    } catch (err) {
        console.error('sendResetEmailController error', err);
        throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
};

// --- POST /auth/reset-pwd
export const resetPasswordController = async (req, res) => {
    const { token, password } = req.body;

    let payload;
    try {
        payload = jwt.verify(token, getEnvVar('JWT_SECRET'));
    } catch (err) {
        console.error('JWT verify failed:', err);
        throw createHttpError(401, 'Token is expired or invalid.');
    }

    const email = payload.email;
    if (!email) {
        throw createHttpError(401, 'Token is expired or invalid.');
    }

    const user = await UsersCollection.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UsersCollection.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });

    await logoutSessionsByUserId(user._id);

    res.status(200).json({
        status: 200,
        message: 'Password has been successfully reset.',
        data: {},
    });
};
