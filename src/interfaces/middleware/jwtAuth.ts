import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenBlacklistService } from '../../infrastructure/services/TokenBlacklistService.ts';

export function jwtVerifyMiddleware(jwtSecret: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.ApiResponse?.error(401, 'No token provided');
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) return res.ApiResponse?.error(401, 'Invalid token');
            if (typeof decoded === 'object' && decoded !== null) {
                req.user = decoded;
                next();
            } else {
                return res.ApiResponse?.error(401, 'Invalid token payload');
            }
        });
    };
}

export function jwtBlacklistCheckMiddleware(tokenBlacklistService: TokenBlacklistService) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.ApiResponse?.error(401, 'No token provided');
        const decoded = jwt.decode(token) as { jti?: string };
        if (!decoded || !decoded.jti) return res.ApiResponse?.error(401, 'Invalid token');
        const isBlacklisted = await tokenBlacklistService.isTokenBlacklisted(decoded.jti);
        if (isBlacklisted) return res.ApiResponse?.error(401, 'Token is blacklisted')
        next();
    };
}
