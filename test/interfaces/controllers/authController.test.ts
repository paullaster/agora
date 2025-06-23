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

app.use((_req, res, next) => {
    res.ApiResponse = {
        success(data?: unknown, status = 200, message = 'OK') {
            res.status(status).json({ success: true, message, data });
        },
        error(status = 500, message = 'Error') {
            res.status(status).json({ success: false, message });
        },
    };
    next();
});

const blacklistedTokens: Set<string> = new Set();

app.post('/auth/login', (req, res, next) => controller.login(req, res, next));
app.post('/auth/logout', (req, res, next) => {
    const auth = req.headers.authorization;
    if (auth) {
        blacklistedTokens.add(auth.replace('Bearer ', ''));
    }
    controller.logout(req, res, next);
});

app.get('/dashboard/profile', (req, res) => {
    const auth = req.headers.authorization;
    const token = auth?.replace('Bearer ', '');
    if (token && !blacklistedTokens.has(token)) {
        return res.json({ data: 'protected content' });
    }
    res.status(401).json({ message: 'Unauthorized' });
});

afterEach(() => {
    jest.clearAllMocks();
    blacklistedTokens.clear();
});


describe('Authentication & JWT Blacklisting', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should login, access protected route, logout, and reject blacklisted JWT', async () => {
        loginExecuteMock.mockResolvedValueOnce({ user: { id: '1', name: 'Jordan Lee', email: 'jordan.lee@example.com', avatar: null, lastLogin: null, role: 'admin' }, token: 'valid.jwt.token' });
        const loginRes = await request(app).post('/auth/login').send({ username: 'jordan.lee@example.com', password: 'Allowme@2025' });
        expect(loginRes.status).toBe(200);
        const token = loginRes.body.data.token;
        expect(token).toBe('valid.jwt.token');
        expect(logger.log).toHaveBeenCalledWith('User login successful', { username: 'jordan.lee@example.com' });

        // Access protected route
        const protectedRes = await request(app).get('/dashboard/profile').set('Authorization', `Bearer ${token}`);
        expect(protectedRes.status).toBe(200);
        expect(protectedRes.body.data).toBe('protected content');

        // Mock logout use case
        logoutExecuteMock.mockResolvedValueOnce({ message: 'Logged out' });
        // Logout
        const logoutRes = await request(app).post('/auth/logout').set('Authorization', `Bearer ${token}`);
        expect(logoutRes.status).toBe(200);
        expect(logger.log).toHaveBeenCalledWith('User logout successful');

        const afterLogoutRes = await request(app).get('/dashboard/profile').set('Authorization', `Bearer ${token}`);
        expect(afterLogoutRes.status).toBe(401);
    });

    test('should return 400 if username or password is missing', async () => {
        const res = await request(app).post('/auth/login').send({ username: 'jordan.lee@example.com' });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(logger.error).toHaveBeenCalledWith('Missing username or password');
    });

    test('should return 400 if token is missing on logout', async () => {
        const res = await request(app).post('/auth/logout');
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(logger.error).toHaveBeenCalledWith('Missing token for logout');
    });
});
