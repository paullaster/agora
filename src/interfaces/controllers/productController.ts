import type { Request, Response, NextFunction } from 'express';
import { ListProductsUseCase } from '../../application/product/ListProductsUseCase.ts';
import { GetProductDetailsUseCase } from '../../application/product/GetProductDetailsUseCase.ts';
import { CreateProductUseCase } from '../../application/product/CreateProductUseCase.ts';
import { deepTranslate, negotiateLanguage } from '../../core/utils/translation.ts';

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
            const lang = negotiateLanguage(req.headers['accept-language'] as string, req.query.lang as string);
            const products = await this.listProductsUseCase.execute(req.query);
            const translated = products.map(p => deepTranslate(p, lang));
            res.ApiResponse!.success(translated);
        } catch (error) {
            next(error);
        }
    }

    async details(req: Request, res: Response, next: NextFunction) {
        try {
            const lang = negotiateLanguage(req.headers['accept-language'] as string, req.query.lang as string);
            const product = await this.getProductDetailsUseCase.execute(req.params.id);
            if (!product) return res.ApiResponse!.error(404, 'Product not found');
            res.ApiResponse!.success(deepTranslate(product, lang));
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { description } = req.body;
            if (!description || typeof description !== 'object' || !description.en || !description.fr) {
                return res.ApiResponse!.error(400, 'Product description must include both English and French');
            }
            const product = await this.createProductUseCase.execute(req.body);
            res.ApiResponse!.success(product, 201, 'Product created');
        } catch (error) {
            next(error);
        }
    }
}
