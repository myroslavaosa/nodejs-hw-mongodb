// src/services/auth.js
import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SessionsCollection } from '../db/models/session.js';


export const registerUser = async (payload) => {
    const { email, password, name } = payload;

    // Check if user exists
    const existingUser = await UsersCollection.findOne({ email });
    if (existingUser) {
        throw createHttpError(409, 'Email in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await UsersCollection.create({
        name,
        email,
        password: hashedPassword,
    });

    // Remove password from response
    const userObject = newUser.toObject();
    delete userObject.password;

    return userObject;
};

// src/services/auth.js
export const createSession = async (userId) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await SessionsCollection.create({
        userId,
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    });

    return { accessToken, refreshToken };
};


export const refreshSession = async (refreshToken) => {

    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

    // 1. Знаходимо сесію
    const session = await SessionsCollection.findOne({ refreshToken });
    if (!session) {
        throw createHttpError(401, 'Invalid refresh token');
    }

    // 2. Перевіряємо, чи ще дійсний
    if (new Date() > session.refreshTokenValidUntil) {
        throw createHttpError(401, 'Refresh token expired');
    }

    // 3. Видаляємо стару сесію
    await SessionsCollection.deleteOne({ _id: session._id });

    // 4. Створюємо нові токени
    const accessToken = jwt.sign(
        { userId: session.userId },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
        { userId: session.userId },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
    );

    // 5. Зберігаємо нову сесію
    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await SessionsCollection.create({
        userId: session.userId,
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    });

    // 6. Повертаємо результат
    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
};

export const logoutSession = async (refreshToken) => {
    // Session anhand des Refresh Tokens finden und löschen
    const session = await SessionsCollection.findOneAndDelete({ refreshToken });
    if (!session) {
        throw createHttpError(401, 'Invalid session');
    }
};
