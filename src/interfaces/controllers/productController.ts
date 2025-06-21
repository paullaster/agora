import type { Request, Response, NextFunction } from 'express';
import { ListProductsUseCase } from '../../application/product/ListProductsUseCase.ts';
import { GetProductDetailsUseCase } from '../../application/product/GetProductDetailsUseCase.ts';
import { CreateProductUseCase } from '../../application/product/CreateProductUseCase.ts';

export class ProductController {
    private listProductsUseCase: ListProductsUseCase;
    private getProductDetailsUseCase: GetProductDetailsUseCase;
    private createProductUseCase: CreateProductUseCase;

    constructor(
        listProductsUseCase: ListProductsUseCase,
        getProductDetailsUseCase: GetProductDetailsUseCase,
        createProductUseCase: CreateProductUseCase
    ) {
        this.listProductsUseCase = listProductsUseCase;
        this.getProductDetailsUseCase = getProductDetailsUseCase;
        this.createProductUseCase = createProductUseCase;
    }

    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await this.listProductsUseCase.execute(req.query);
            res.ApiResponse!.success(products);
        } catch (error) {
            next(error);
        }
    }

    async details(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await this.getProductDetailsUseCase.execute(req.params.id);
            if (!product) return res.ApiResponse!.error(404, 'Product not found');
            res.ApiResponse!.success(product);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await this.createProductUseCase.execute(req.body);
            res.ApiResponse!.success(product, 201, 'Product created');
        } catch (error) {
            next(error);
        }
    }
}
