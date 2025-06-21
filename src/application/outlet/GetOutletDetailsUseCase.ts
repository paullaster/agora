import type { IOutletRepository } from '../../core/repositories/interfaces.ts';

export class GetOutletDetailsUseCase {
    private outletRepository: IOutletRepository;
    constructor(outletRepository: IOutletRepository) {
        this.outletRepository = outletRepository;
    }
    async execute(id: string) {
        return await this.outletRepository.findById(id);
    }
}
