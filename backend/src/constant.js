import 'dotenv/config';

export const DB_NAME = "shrinClick_url_shortener";

export const JWT_SECRET = process.env.JWT_SECRET_KEY.toString() || "secret";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN.toString() || "1d";

export const cookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 12 * 60 * 60 * 1000,   // 12 hours
    secure: process.env.NODE_ENV.toString() === 'production' ? true : false,
};