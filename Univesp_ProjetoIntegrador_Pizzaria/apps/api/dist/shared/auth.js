import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './appError.js';
export function signAccessToken(input) {
    return jwt.sign({}, env.JWT_SECRET, { subject: input.customerId, expiresIn: '7d' });
}
export function verifyAccessToken(token) {
    try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        if (typeof payload !== 'object' || payload === null)
            throw new Error('Invalid token payload');
        const sub = payload.sub;
        if (typeof sub !== 'string' || !sub)
            throw new Error('Invalid subject');
        return { sub };
    }
    catch {
        throw new AppError({ statusCode: 401, code: 'UNAUTHORIZED', message: 'Token inválido' });
    }
}
