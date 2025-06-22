/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse as csvParse } from 'csv-parse/sync';
import streamJson from 'stream-json';
import StreamArray from 'stream-json/streamers/StreamArray.js';
import { Writable } from 'node:stream';
import { readFile, writeFile } from 'fs/promises';
import type { ILoggingProvider } from '../../core/providers/ILoggingProvider.ts';
import { AppError } from '../../core/entities/error.ts';

export interface IngestDataParams {
    fileBuffer: Buffer;
    fileMimetype: string;
    dataType: string;
    faqsMode?: 'append' | 'overwrite';
}

export class IngestDataUseCase {
    private logger: ILoggingProvider;
    private repositories: Record<string, any>;
    private faqsFilePath: string;
    constructor(logger: ILoggingProvider, repositories: Record<string, any>, faqsFilePath: string) {
        this.logger = logger;
        this.repositories = repositories;
        this.faqsFilePath = faqsFilePath;
    }
    async execute(params: IngestDataParams) {
        const { fileBuffer, fileMimetype, dataType, faqsMode = 'overwrite' } = params;
        if (dataType === 'faqs') {
            return await this.handleFaqs(fileBuffer, faqsMode);
        }
        let records: any[] = [];
        if (fileMimetype.includes('csv')) {
            records = csvParse(fileBuffer.toString(), { columns: true, skip_empty_lines: true });
        } else if (fileMimetype.includes('json')) {
            records = await this.parseJsonStream(fileBuffer);
        } else {
            this.logger.error('Unsupported file type', { fileMimetype });
            throw new AppError('Unsupported file type');
        }
        if (!Array.isArray(records)) {
            this.logger.error('Parsed data is not an array', { dataType });
            throw new AppError('Parsed data is not an array');
        }
        const repo = this.repositories[dataType];
        if (!repo || typeof repo.saveBulk !== 'function') {
            this.logger.error('No repository found for dataType', { dataType });
            throw new AppError('No repository found for dataType');
        }
        const result = await repo.saveBulk(records);
        this.logger.log('Bulk insert successful', { dataType, count: records.length });
        return { inserted: records.length, result };
    }

    private async handleFaqs(fileBuffer: Buffer, faqsMode: 'append' | 'overwrite') {
        const newFaqs = await this.parseJsonStream(fileBuffer);
        if (!Array.isArray(newFaqs)) throw new AppError('FAQs data must be an array');
        let faqs: any[] = [];
        if (faqsMode === 'append') {
            try {
                const existing = await readFile(this.faqsFilePath, 'utf-8');
                faqs = JSON.parse(existing);
                if (!Array.isArray(faqs)) throw new AppError('Existing FAQs file is not an array');
            } catch (e: any) {
                if (e.code === 'ENOENT') {
                    faqs = [];
                } else {
                    this.logger.error('Error reading FAQs file', { error: e });
                    throw e;
                }
            }
            faqs = faqs.concat(newFaqs);
        } else {
            faqs = newFaqs;
        }
        await writeFile(this.faqsFilePath, JSON.stringify(faqs, null, 2));
        this.logger.log('FAQs file updated', { faqsMode, count: faqs.length });
        return { faqsCount: faqs.length };
    }

    private async parseJsonStream(fileBuffer: Buffer): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const records: any[] = [];
            const readable = new Writable({
                objectMode: true,
                write({ value }, _enc, cb) {
                    records.push(value);
                    cb();
                }
            });
            const pipeline = streamJson.parser()
                .pipe(StreamArray.streamArray())
                .pipe(readable);
            pipeline.on('finish', () => resolve(records));
            pipeline.on('error', (err: Error) => reject(err));
            pipeline.end(fileBuffer);
        });
    }
}
