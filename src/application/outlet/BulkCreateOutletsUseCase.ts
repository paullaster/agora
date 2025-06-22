import type { IOutletRepository } from '../../core/repositories/interfaces.ts';
import type { Outlet } from '../../core/entities/outlets.ts';

export class BulkCreateOutletsUseCase {
    private outletRepository: IOutletRepository;
    constructor(outletRepository: IOutletRepository) {
        this.outletRepository = outletRepository;
    }
    async execute(outlets: Outlet[]) {
        return await this.outletRepository.saveBulk(outlets);
    }
}
