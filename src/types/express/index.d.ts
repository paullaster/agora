/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/express/index.d.ts
import 'express-serve-static-core';

declare module 'express-serve-static-core' {
    interface Response {
        ApiResponse?: {
            success: (data?: any, statusCode?: number, message?: string) => void;
            error: (statusCode?: number, message?: string, data?: any) => void;
        };
    }
    interface Request {
        user?: Record<string, any>
    }
}
