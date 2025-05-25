import jwt from 'jsonwebtoken';
import {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    cookieOptions
} from '../constant.js';

export function generateToken(response, user) {
    const payload = {
        userId: user._id,
        email: user.email.toString().toLowerCase()
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });

    response.cookie('accessToken', token, cookieOptions);

    // NOTE - Return JWT Token
    return token;
}

export function verifyToken(token) {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded Token Info: ', decoded.userId);
    return decoded;
}

export function verifyTokenEasy(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded Token Info: ', decoded.userId);
        return decoded;
    } catch (error) {
        console.log('Token verification failed:', error.message);
        return null; // Return null instead of throwing error
    }
}