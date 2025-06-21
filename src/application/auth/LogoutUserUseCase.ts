import { InValidData } from '../../core/entities/error.ts';
import type { TokenBlacklistService } from '../../infrastructure/services/TokenBlacklistService.ts';
import jwt from 'jsonwebtoken';

export class LogoutUserUseCase {
    private tokenBlacklistService: TokenBlacklistService;
    constructor(tokenBlacklistService: TokenBlacklistService) {
        this.tokenBlacklistService = tokenBlacklistService;
    }
    async execute(token: string): Promise<{ message: string }> {
        const decoded = jwt.decode(token) as { jti?: string; exp?: number };
        if (!decoded || !decoded.jti || !decoded.exp) {
            throw new InValidData('Invalid token');
        }
        const expiresInSeconds = decoded.exp - Math.floor(Date.now() / 1000);
        if (expiresInSeconds > 0) {
            await this.tokenBlacklistService.blacklistToken(decoded.jti, expiresInSeconds);
            this.tokenBlacklistService.destroyRedisClient();
        }
        return { message: 'Logged out' };
    }
}
