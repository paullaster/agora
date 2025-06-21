import type { IProductRepository } from '../../core/repositories/interfaces.ts';
import type { Product } from '../../core/entities/product.ts';

export class CreateProductUseCase {
    private productRepository: IProductRepository;
    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }
    async execute(product: Product) {
        return await this.productRepository.save(product);
    }
}
