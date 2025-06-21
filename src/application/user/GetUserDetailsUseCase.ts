import type { IUserRepository } from '../../core/repositories/interfaces.ts';

export class GetUserDetailsUseCase {
    private userRepository: IUserRepository;
    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }
    async execute(id: string) {
        return await this.userRepository.findById(id);
    }
}
