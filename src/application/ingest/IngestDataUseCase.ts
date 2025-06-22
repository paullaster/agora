/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse as csvParse } from 'csv-parse/sync';
import streamJson from 'stream-json';
import StreamArray from 'stream-json/streamers/StreamArray.js';
import { Writable, Readable } from 'node:stream';
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
        const repo = this.repositories[dataType].repo;
        if (!repo || typeof repo.saveBulk !== 'function') {
            this.logger.error('No repository found for dataType', { dataType });
            throw new AppError('No repository found for dataType');
        }
        if (dataType === 'products') {
            for (const record of records) {
                if (!record.description || typeof record.description !== 'object' || !record.description.en || !record.description.fr) {
                    this.logger.error('Missing English or French description in product ingestion', { record });
                    throw new AppError('Each product must have both English and French descriptions');
                }
            }
        }
        const result = await repo.saveBulk(await Promise.all(records.map(async dto => await this.repositories[dataType].entity.createFromRawObject(dto))));
        this.logger.log('Bulk insert successful', { dataType, count: records.length });
        return { inserted: records.length, result };
    }

    private async handleFaqs(fileBuffer: Buffer, faqsMode: 'append' | 'overwrite') {
        this.logger.log('FAQ upload buffer', { length: fileBuffer.length, sample: fileBuffer.toString('utf8', 0, 200) });
        let newFaqs: any[] = [];
        const isLikelyCsv = fileBuffer.slice(0, 200).toString().includes(',') && !fileBuffer.slice(0, 200).toString().trim().startsWith('[');
        if (isLikelyCsv) {
            newFaqs = csvParse(fileBuffer.toString(), { columns: true, skip_empty_lines: true });
            this.logger.log('Parsed CSV FAQs', { count: newFaqs.length, sample: newFaqs.slice(0, 2) });
        } else {
            newFaqs = await this.parseJsonStream(fileBuffer);
            this.logger.log('Parsed JSON FAQs', { count: Array.isArray(newFaqs) ? newFaqs.length : 0, sample: newFaqs.slice(0, 2) });
        }
        if (!Array.isArray(newFaqs) || newFaqs.length === 0 || newFaqs.every(item => item === null)) {
            throw new AppError('FAQs data must be a non-empty array');
        }
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
            faqs = faqs.concat(newFaqs.filter(Boolean));
        } else {
            faqs = newFaqs.filter(Boolean);
        }
        try {
            await writeFile(this.faqsFilePath, JSON.stringify(faqs, null, 2));
        } catch (e) {
            this.logger.error('Failed to write FAQs file', { error: e, path: this.faqsFilePath });
            throw e;
        }
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
            Readable.from(fileBuffer)
                .pipe(streamJson.parser())
                .pipe(StreamArray.streamArray())
                .pipe(readable)
                .on('finish', () => resolve(records))
                .on('error', (err: Error) => reject(err));
        });
    }
}
