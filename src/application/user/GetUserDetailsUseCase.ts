import type { IUserRepository } from '../../core/repositories/interfaces.ts';

export class GetUserDetailsUseCase {
    private userRepository: IUserRepository;
    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }
    async execute(id: string) {
        const user = await this.userRepository.findById(id)
        return user?.toSafeObject(user);
    }
}
