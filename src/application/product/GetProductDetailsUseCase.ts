import type { IProductRepository } from '../../core/repositories/interfaces.ts';

export class GetProductDetailsUseCase {
    private productRepository: IProductRepository;
    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }
    async execute(id: string) {
        return await this.productRepository.findById(id);
    }
}
