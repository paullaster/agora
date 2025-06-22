import { Router } from 'express';
import { AuthController } from '../controllers/authController.ts';
import { LoginUserUseCase } from '../../application/auth/LoginUserUseCase.ts';
import { LogoutUserUseCase } from '../../application/auth/LogoutUserUseCase.ts';
import { mongoDBProvider } from '../../infrastructure/database/index.ts';
import { MongoDBUserRepository } from '../../infrastructure/repositories/userRepository.ts';
import { TokenBlacklistService } from '../../infrastructure/services/TokenBlacklistService.ts';
import { PinoLogger } from '../../infrastructure/logger/pinoLogger.ts';

// Setup dependencies
const userRepository = new MongoDBUserRepository(mongoDBProvider.connection, mongoDBProvider.models.User);
const jwtSecret = process.env.JWT_SECRET || 'unique:secret:agro:ecology:app:2025-paullaster';
const logger = new PinoLogger('auth');
const loginUserUseCase = new LoginUserUseCase(userRepository, jwtSecret);
const tokenBlacklistService = await TokenBlacklistService.init(logger);
const logoutUserUseCase = new LogoutUserUseCase(tokenBlacklistService);

const authController = new AuthController(loginUserUseCase, logoutUserUseCase, logger);

const router = Router({ mergeParams: true, caseSensitive: true });

router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res, next));

export default router;
