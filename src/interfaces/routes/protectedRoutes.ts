import { Router } from 'express';
import { jwtVerifyMiddleware, jwtBlacklistCheckMiddleware } from '../middleware/jwtAuth.ts';
import { TokenBlacklistService } from '../../infrastructure/services/TokenBlacklistService.ts';
import { PinoLogger } from '../../infrastructure/logger/pinoLogger.ts';
import { DashboardController } from '../controllers/dashboardController.ts';
import { requireRole } from '../middleware/requireRole.ts';

const logger = new PinoLogger('auth');
const jwtSecret = process.env.JWT_SECRET || 'unique:secret:agro:ecology:app:2025-paullaster';
const tokenBlacklistService = await TokenBlacklistService.init(logger);

const router = Router({ mergeParams: true, caseSensitive: true });
const dashboardController = new DashboardController();

router.get('/profile',
    jwtVerifyMiddleware(jwtSecret),
    jwtBlacklistCheckMiddleware(tokenBlacklistService),
    (req, res) => {
        res.ApiResponse?.success({ user: req.user }, 200, 'Authenticated user profile');
    }
);

router.get('/',
    jwtVerifyMiddleware(jwtSecret),
    jwtBlacklistCheckMiddleware(tokenBlacklistService),
    requireRole('admin'),
    (req, res, next) => dashboardController.getDashboardMetrics(req, res, next)
);

export default router;
