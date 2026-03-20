import { verifyAccessToken } from './auth.js';
export function requireAuth(req, res, next) {
    const header = req.header('authorization') ?? '';
    const [kind, token] = header.split(' ');
    if (kind !== 'Bearer' || !token) {
        res.status(401).json({ code: 'UNAUTHORIZED', message: 'Token ausente' });
        return;
    }
    const payload = verifyAccessToken(token);
    req.auth = { customerId: payload.sub };
    next();
}
