import express from 'express';
import { IngestDataUseCase } from '../../application/ingest/IngestDataUseCase.ts';
import type { ILoggingProvider } from '../../core/providers/ILoggingProvider.ts';

export class IngestController {
    private ingestDataUseCase: IngestDataUseCase;
    private logger: ILoggingProvider;
    constructor(ingestDataUseCase: IngestDataUseCase, logger: ILoggingProvider) {
        this.ingestDataUseCase = ingestDataUseCase;
        this.logger = logger;
    }
    async ingest(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const file = req.file;
            const dataType = req.body.dataType || req.query.dataType;
            const faqsMode = req.body.faqsMode || req.query.faqsMode || 'overwrite';
            if (!file || !dataType) {
                this.logger.error('Missing file or dataType in upload');
                return res.ApiResponse?.error(400, 'Missing file or dataType');
            }
            const result = await this.ingestDataUseCase.execute({
                fileBuffer: file.buffer,
                fileMimetype: file.mimetype,
                dataType,
                faqsMode,
            });
            this.logger.log('Data ingestion successful', { dataType, faqsMode });
            res.ApiResponse?.success(result, 201, 'Data ingested successfully');
        } catch (error) {
            this.logger.error('Data ingestion failed', { error });
            next(error);
        }
    }
}
