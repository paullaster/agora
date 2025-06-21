import type { IUserRepository } from '../../core/repositories/interfaces.ts';
import type { User } from '../../core/entities/user.ts';

export class CreateUserUseCase {
    private userRepository: IUserRepository;
    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }
    async execute(user: User) {
        return await this.userRepository.save(user);
    }
}
