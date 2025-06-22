import { Router } from 'express';
import { ProductController } from '../controllers/productController.ts';
import { ListProductsUseCase } from '../../application/product/ListProductsUseCase.ts';
import { MongoDBProductRepository } from '../../infrastructure/repositories/productRepository.ts';
import { mongoDBProvider } from '../../infrastructure/database/index.ts';
import { GetProductDetailsUseCase } from '../../application/product/GetProductDetailsUseCase.ts';
import { CreateProductUseCase } from '../../application/product/CreateProductUseCase.ts';


// Prouct repository
const productRepository = new MongoDBProductRepository(mongoDBProvider.connection, mongoDBProvider.models.Product);
// useCases
const listingProductUseCase = new ListProductsUseCase(productRepository);
const productDetails = new GetProductDetailsUseCase(productRepository);
const createProductUSeCase = new CreateProductUseCase(productRepository);

const productController = new ProductController(listingProductUseCase, productDetails, createProductUSeCase);

const router = Router({ mergeParams: true, caseSensitive: true });

router.get('/', (req, res, next) => productController.list(req, res, next));
router.get('/:id', (req, res, next) => productController.details(req, res, next));
router.post('/', (req, res, next) => productController.create(req, res, next));

export default router;
