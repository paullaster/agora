import type { Request, Response, NextFunction } from 'express';
import { FaqService } from '../../core/services/faqService.ts';
import { FaqRepository } from '../../infrastructure/repositories/FaqRepository.ts';
import { negotiateLanguage, deepTranslate } from '../../core/utils/translation.ts';

const faqService = new FaqService(new FaqRepository());

export class FaqController {
    async getFaqs(req: Request, res: Response, next: NextFunction) {
        try {
            const faqs = await faqService.getAllActiveFaqs();
            const lang = negotiateLanguage(req.headers['accept-language'] as string, req.query.lang as string);
            const translatedFaqs = faqs.map(faq => deepTranslate(faq, lang));
            res.status(200).json({ faqs: translatedFaqs });
        } catch (err) {
            next(err);
        }
    }
}
