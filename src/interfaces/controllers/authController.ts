import express from 'express';
import type { LoginUserUseCase } from '../../application/auth/LoginUserUseCase.ts';
import type { LogoutUserUseCase } from '../../application/auth/LogoutUserUseCase.ts';
import type { ILoggingProvider } from '../../core/providers/ILoggingProvider.ts';

export class AuthController {
    private loginUserUseCase: LoginUserUseCase;
    private logoutUserUseCase: LogoutUserUseCase;
    private logger: ILoggingProvider;

    constructor(
        loginUserUseCase: LoginUserUseCase,
        logoutUserUseCase: LogoutUserUseCase,
        logger: ILoggingProvider
    ) {
        this.loginUserUseCase = loginUserUseCase;
        this.logoutUserUseCase = logoutUserUseCase;
        this.logger = logger;
    }

    async login(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                this.logger.error('Missing username or password');
                return res.ApiResponse?.error(400, 'Missing username or password');
            }
            const result = await this.loginUserUseCase.execute(username, password);
            this.logger.log('User login successful', { username });
            res.ApiResponse?.success(result, 200, 'Login successful');
        } catch (error) {
            this.logger.error('Login failed', { error });
            next(error);
        }
    }

    async logout(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                this.logger.error('Missing token for logout');
                return res.ApiResponse?.error(400, 'Missing token');
            }
            await this.logoutUserUseCase.execute(token);
            this.logger.log('User logout successful');
            res.ApiResponse?.success(null, 200, 'Logout successful');
        } catch (error) {
            this.logger.error('Logout failed', { error });
            next(error);
        }
    }
}
