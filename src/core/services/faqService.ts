import type { IFaq } from '../entities/faq.ts';
import type { IFaqRepository } from '../repositories/IFaqRepository.ts';

export class FaqService {
    private faqRepository: IFaqRepository
    constructor(faqRepository: IFaqRepository) {
        this.faqRepository = faqRepository;
    }

    async getAllActiveFaqs(): Promise<IFaq[]> {
        return await this.faqRepository.findAllActive();
    }
}
