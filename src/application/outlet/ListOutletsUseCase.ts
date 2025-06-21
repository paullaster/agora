import type { IOutletRepository } from '../../core/repositories/interfaces.ts';
import type { QueryInterace } from '../../types/db.ts';

export class ListOutletsUseCase {
    private outletRepository: IOutletRepository;
    constructor(outletRepository: IOutletRepository) {
        this.outletRepository = outletRepository;
    }
    async execute(query: QueryInterace) {
        return await this.outletRepository.findAll(query);
    }
}
