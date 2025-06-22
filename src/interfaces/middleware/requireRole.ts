import type { RequestHandler } from 'express';

export function requireRole(requiredRole: string): RequestHandler {
    return (req, res, next) => {
        const user = req.user as { role?: string } | undefined;
        if (!user || !user.role) {
            res.status(401).json({ message: 'Unauthorized: No user role found.' });
            return;
        }
        if (user.role !== requiredRole) {
            res.status(403).json({ message: 'Forbidden: Insufficient role.' });
            return;
        }
        next();
    };
}
