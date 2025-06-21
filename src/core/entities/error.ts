export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class InValidData extends AppError {
    constructor(message = 'Invalid data') {
        super(message, 400);
        Error.captureStackTrace(this, this.constructor);
    }
}