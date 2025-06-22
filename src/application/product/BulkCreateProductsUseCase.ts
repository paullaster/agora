import type { IProductRepository } from '../../core/repositories/interfaces.ts';
import type { Product } from '../../core/entities/product.ts';

export class BulkCreateProductsUseCase {
    private productRepository: IProductRepository;
    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }
    async execute(products: Product[]) {
        return await this.productRepository.saveBulk(products);
    }
}
