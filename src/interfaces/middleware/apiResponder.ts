import { PinoLogger } from '../../infrastructure/logger/pinoLogger.ts';
import type { Request, Response, NextFunction } from 'express';

const logger = new PinoLogger('apiResponder');

export const ApiResponder = (_req: Request, res: Response, next: NextFunction) => {
    res.ApiResponse = {
        success(data = {}, statusCode = 200, message = 'Success') {
            try {
                res.setHeader('Document-Policy', 'js-profiling');
                res.status(statusCode).json({ message, data });
                logger.log('API Success', { statusCode, message, data });
            } catch (error: unknown) {
                const errMsg = error instanceof Error ? error.message : 'Unknown error';
                return this.error(500, errMsg, error);
            }
        },
        error(statusCode = 500, message = "Error", data = {}) {
            logger.error(message, { statusCode, data });
            res.status(statusCode).json({ message, data });
        }
    };
    next();
};