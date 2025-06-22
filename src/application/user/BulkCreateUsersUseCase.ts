import type { IUserRepository } from '../../core/repositories/interfaces.ts';
import type { User } from '../../core/entities/user.ts';

export class BulkCreateUsersUseCase {
    private userRepository: IUserRepository;
    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }
    async execute(users: User[]) {
        return await this.userRepository.saveBulk(users);
    }
}
