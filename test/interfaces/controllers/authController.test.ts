/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { AuthController } from '../../../src/interfaces/controllers/authController';
import type { LoginUserUseCase } from '../../../src/application/auth/LoginUserUseCase';
import type { LogoutUserUseCase } from '../../../src/application/auth/LogoutUserUseCase';
import type { ILoggingProvider } from '../../../src/core/providers/ILoggingProvider';

// Mocks
const loginExecuteMock: jest.MockedFunction<LoginUserUseCase['execute']> = jest.fn();
const logoutExecuteMock: jest.MockedFunction<LogoutUserUseCase['execute']> = jest.fn();
const logger: ILoggingProvider = {
    log: jest.fn(),
    error: jest.fn(),
};

const loginUserUseCase: LoginUserUseCase = { execute: loginExecuteMock } as unknown as LoginUserUseCase;
const logoutUserUseCase: LogoutUserUseCase = { execute: logoutExecuteMock } as unknown as LogoutUserUseCase;

const controller = new AuthController(loginUserUseCase, logoutUserUseCase, logger);

const app = express();
app.use(express.json());

beforeAll(() => {
    (express.response as any).ApiResponse = {
        success(this: express.Response, data?: unknown, status = 200, message = 'OK') {
            this.status(status).json({ success: true, message, data });
        },
        error(this: express.Response, status = 500, message = 'Error') {
            this.status(status).json({ success: false, message });
        },
    };
});

app.post('/login', (req, res, next) => controller.login(req, res, next));
app.post('/logout', (req, res, next) => controller.logout(req, res, next));

app.get('/protected', ((req, res) => {
    const auth = req.headers.authorization;
    if (auth === 'Bearer valid.jwt.token') {
        return res.json({ data: 'protected content' });
    }
    res.status(401).json({ message: 'Unauthorized' });
}) as any);

describe('Authentication & JWT Blacklisting', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should login, access protected route, logout, and reject blacklisted JWT', async () => {
        // Mock login use case to return a token
        loginExecuteMock.mockResolvedValueOnce({ user: { id: '1', name: 'Test User', email: 'test@test.com', avatar: null, lastLogin: null }, token: 'valid.jwt.token' });
        // Login
        const loginRes = await request(app).post('/login').send({ username: 'test', password: 'password' });
        expect(loginRes.status).toBe(200);
        const token = loginRes.body.data.token;
        expect(token).toBe('valid.jwt.token');
        expect(logger.log).toHaveBeenCalledWith('User login successful', { username: 'test' });

        // Access protected route
        const protectedRes = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
        expect(protectedRes.status).toBe(200);
        expect(protectedRes.body.data).toBe('protected content');

        // Mock logout use case
        logoutExecuteMock.mockResolvedValueOnce({ message: 'Logged out' });
        // Logout
        const logoutRes = await request(app).post('/logout').set('Authorization', `Bearer ${token}`);
        expect(logoutRes.status).toBe(200);
        expect(logger.log).toHaveBeenCalledWith('User logout successful');

        // Try to access protected route again (simulate blacklist)
        const afterLogoutRes = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
        // Simulate blacklisted token
        expect(afterLogoutRes.status).toBe(401);
    });

    test('should return 400 if username or password is missing', async () => {
        const res = await request(app).post('/login').send({ username: 'test' });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(logger.error).toHaveBeenCalledWith('Missing username or password');
    });

    test('should return 400 if token is missing on logout', async () => {
        const res = await request(app).post('/logout');
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(logger.error).toHaveBeenCalledWith('Missing token for logout');
    });
});
