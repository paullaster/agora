import type { IFaq } from '../entities/faq.ts';

export interface IFaqRepository {
    findAllActive(): Promise<IFaq[]>;
}
