import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../core/entities/error.ts'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof AppError) {
        res.ApiResponse!.error(err.statusCode, err.message, err.stack);
    } else {
        res.ApiResponse!.error(500, 'Internal Server Error', err.stack);
    }
}