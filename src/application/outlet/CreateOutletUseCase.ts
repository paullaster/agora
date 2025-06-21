import type { IOutletRepository } from '../../core/repositories/interfaces.ts';
import type { Outlet } from '../../core/entities/outlets.ts';

export class CreateOutletUseCase {
    private outletRepository: IOutletRepository;
    constructor(outletRepository: IOutletRepository) {
        this.outletRepository = outletRepository;
    }
    async execute(outlet: Outlet) {
        return await this.outletRepository.save(outlet);
    }
}
