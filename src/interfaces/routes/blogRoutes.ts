import { Router } from 'express';
import { BlogController } from '../controllers/blogController.ts';
import { ListBlogsUseCase } from '../../application/blog/ListBlogsUseCase.ts';
import { GetBlogDetailsUseCase } from '../../application/blog/GetBlogDetailsUseCase.ts';
import { CreateBlogUseCase } from '../../application/blog/CreateBlogUseCase.ts';
import { MongoDBBlogRepository } from '../../infrastructure/repositories/blogRepository.ts';
import { mongoDBProvider } from '../../infrastructure/database/index.ts';
import { jwtVerifyMiddleware, jwtBlacklistCheckMiddleware } from '../middleware/jwtAuth.ts';
import { TokenBlacklistService } from '../../infrastructure/services/TokenBlacklistService.ts';
import { PinoLogger } from '../../infrastructure/logger/pinoLogger.ts';
import config from '../../infrastructure/config/index.ts';

const logger = new PinoLogger('auth');
const jwtSecret = config.app.key;
const tokenBlacklistService = await TokenBlacklistService.init(logger);

const blogRepository = new MongoDBBlogRepository(mongoDBProvider.connection, mongoDBProvider.models.Blog);
const listBlogsUseCase = new ListBlogsUseCase(blogRepository);
const getBlogDetailsUseCase = new GetBlogDetailsUseCase(blogRepository);
const createBlogUseCase = new CreateBlogUseCase(blogRepository);

const blogController = new BlogController(listBlogsUseCase, getBlogDetailsUseCase, createBlogUseCase);

const router = Router({ mergeParams: true, caseSensitive: true });

router.get('/', (req, res, next) => blogController.list(req, res, next));
router.get('/:id', (req, res, next) => blogController.details(req, res, next));
router.post('/',
    jwtVerifyMiddleware(jwtSecret),
    jwtBlacklistCheckMiddleware(tokenBlacklistService),
    (req, res, next) => blogController.create(req, res, next)
);

export default router;
