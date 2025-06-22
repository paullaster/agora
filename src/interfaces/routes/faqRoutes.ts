import { Router } from 'express';
import { FaqController } from '../controllers/faqController.ts';

const router = Router({ mergeParams: true, caseSensitive: true });
const faqController = new FaqController();

router.get('/', (req, res, next) => faqController.getFaqs(req, res, next));

export default router;
