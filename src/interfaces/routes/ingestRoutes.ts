/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { IngestController } from '../controllers/ingestController.ts';
import { IngestDataUseCase } from '../../application/ingest/IngestDataUseCase.ts';
import { PinoLogger } from '../../infrastructure/logger/pinoLogger.ts';
import { MongoDBProductRepository } from '../../infrastructure/repositories/productRepository.ts';
import { FaqRepository } from '../../infrastructure/repositories/FaqRepository.ts';
import { uploadMiddleware } from '../middleware/upload/uploadMiddleware.ts';
import { mongoDBProvider } from '../../infrastructure/database/index.ts';
import { MongoDBUserRepository } from '../../infrastructure/repositories/userRepository.ts';
import { MongoDBBlogRepository } from '../../infrastructure/repositories/blogRepository.ts';
import { MongoDBOutletRepository } from '../../infrastructure/repositories/outletRepository.ts';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'path';
import { User } from '../../core/entities/user.ts';
import { Product } from '../../core/entities/product.ts';
import { Blog } from '../../core/entities/blog.ts';
import { Outlet } from '../../core/entities/outlets.ts';
import { Faq } from '../../core/entities/faq.ts';

const logger = new PinoLogger('ingest');

type RepoMap = { [key: string]: any };
const repositories: RepoMap = {
    products: {
        repo: new MongoDBProductRepository(mongoDBProvider.connection, mongoDBProvider.models.Product),
        entity: Product,
    },
    users: {
        repo: new MongoDBUserRepository(mongoDBProvider.connection, mongoDBProvider.models.User),
        entity: User,
    },
    blogs: {
        repo: new MongoDBBlogRepository(mongoDBProvider.connection, mongoDBProvider.models.Blog),
        entity: Blog,
    },
    outlets: {
        repo: new MongoDBOutletRepository(mongoDBProvider.connection, mongoDBProvider.models.Outlet),
        entity: Outlet,
    },
    faqs: {
        repo: new FaqRepository(),
        entity: Faq,
    },
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(dirname(__filename)));
const faqsFilePath = resolve(join(__dirname, 'infrastructure', 'database', 'faq.json'));
const ingestDataUseCase = new IngestDataUseCase(logger, repositories, faqsFilePath);
const ingestController = new IngestController(ingestDataUseCase, logger);

const router = Router({ mergeParams: true, caseSensitive: true });

router.post('/', uploadMiddleware.single('file'), (req, res, next) => ingestController.ingest(req, res, next));

export default router;
