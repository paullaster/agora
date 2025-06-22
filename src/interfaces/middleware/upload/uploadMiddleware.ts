import type { Request } from 'express';
import type { FileFilterCallback } from 'multer';
import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 1000 },
    fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const allowedTypes = [
            'application/json',
            'text/csv',
            'application/vnd.ms-excel',
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname);
            error.message = 'Only JSON and CSV files are allowed';
            cb(error);
        }
    },
});
