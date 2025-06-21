import type { IUserRepository } from '../../core/repositories/interfaces.ts';
import type { QueryInterace } from '../../types/db.ts';

export class ListUsersUseCase {
    private userRepository: IUserRepository;
    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }
    async execute(query: QueryInterace) {
        return await this.userRepository.findAll(query);
    }
}
