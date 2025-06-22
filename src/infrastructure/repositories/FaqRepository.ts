import { readFile } from 'fs/promises';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'node:url';
import type { IFaq } from '../../core/entities/faq.ts';
import type { IFaqRepository } from '../../core/repositories/IFaqRepository.ts';

interface FaqJson {
    id: string;
    question: IFaq['question'];
    answer: IFaq['answer'];
    category?: string;
    order?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

export class FaqRepository implements IFaqRepository {
    async findAllActive(): Promise<IFaq[]> {
        const filePath = resolve(join(__dirname, 'database', 'faq.json'));
        const data = await readFile(filePath, 'utf-8');
        const rawFaqs: FaqJson[] = JSON.parse(data);
        const faqs: IFaq[] = rawFaqs.map((faq) => ({
            _id: faq.id,
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            order: faq.order,
            isActive: faq.isActive,
            createdAt: new Date(faq.createdAt),
            updatedAt: new Date(faq.updatedAt),
        }));
        return faqs
            .filter((faq) => faq.isActive)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.createdAt.getTime() - b.createdAt.getTime());
    }
}
