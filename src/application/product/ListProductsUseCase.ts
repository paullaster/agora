import type { IProductRepository } from '../../core/repositories/interfaces.ts';
import type { QueryInterace } from '../../types/db.ts';

export class ListProductsUseCase {
    private productRepository: IProductRepository;
    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }
    async execute(query: QueryInterace) {
        return await this.productRepository.findAll(query);
    }
}
