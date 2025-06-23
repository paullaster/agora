import { Router } from 'express';
import { jwtVerifyMiddleware, jwtBlacklistCheckMiddleware } from '../middleware/jwtAuth.ts';
import { TokenBlacklistService } from '../../infrastructure/services/TokenBlacklistService.ts';
import { PinoLogger } from '../../infrastructure/logger/pinoLogger.ts';
import { DashboardController } from '../controllers/dashboardController.ts';
import { requireRole } from '../middleware/requireRole.ts';
import config from '../../infrastructure/config/index.ts';

const logger = new PinoLogger('auth');
const jwtSecret = config.app.key;
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
