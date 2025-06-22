import { describe, test, expect, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { uploadMiddleware } from '../../../src/interfaces/middleware/upload/uploadMiddleware';
import { IngestController } from '../../../src/interfaces/controllers/ingestController';
import { IngestDataUseCase } from '../../../src/application/ingest/IngestDataUseCase';
import type { ILoggingProvider } from '../../../src/core/providers/ILoggingProvider';

// Mock logger
const logger: ILoggingProvider = {
    log: jest.fn(),
    error: jest.fn(),
};

// Mock use case
const executeMock: jest.MockedFunction<IngestDataUseCase['execute']> = jest.fn();
const ingestDataUseCase: IngestDataUseCase = { execute: executeMock } as unknown as IngestDataUseCase;

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const controller = new IngestController(ingestDataUseCase, logger);
app.post('/ingest', uploadMiddleware.single('file'), (req, res, next) => controller.ingest(req, res, next));

beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (express.response as any).ApiResponse = {
        success(this: express.Response, data?: unknown, status = 200, message = 'OK') {
            this.status(status).json({ success: true, message, data });
        },
        error(this: express.Response, status = 500, message = 'Error') {
            this.status(status).json({ success: false, message });
        },
    };
});

describe('IngestController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return 400 if file or dataType is missing', async () => {
        const res = await request(app).post('/ingest').send({});
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(logger.error).toHaveBeenCalledWith('Missing file or dataType in upload');
    });

    test('should call use case and return 201 on success', async () => {
        executeMock.mockResolvedValueOnce({ inserted: 2, result: {} });
        const buffer = Buffer.from('[{"test":"ingestion"}]');
        const res = await request(app)
            .post('/ingest')
            .field('dataType', 'products')
            .attach('file', buffer, { filename: 'test.json', contentType: 'application/json' });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual({ inserted: 2, result: {} });
        expect(logger.log).toHaveBeenCalledWith('Data ingestion successful', { dataType: 'products', faqsMode: 'overwrite' });
    });

    test('should handle errors and call next', async () => {
        executeMock.mockRejectedValueOnce(new Error('fail'));
        const buffer = Buffer.from('[{"test":"ingestion"}]');
        const res = await request(app)
            .post('/ingest')
            .field('dataType', 'products')
            .attach('file', buffer, { filename: 'test.json', contentType: 'application/json' });
        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(logger.error).toHaveBeenCalledWith('Data ingestion failed', expect.anything());
    });
});
