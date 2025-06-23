import type { IUserRepository } from '../../core/repositories/interfaces.ts';
import jwt from 'jsonwebtoken';
import { InValidData } from '../../core/entities/error.ts';
import { randomUUID } from 'crypto';

export class LoginUserUseCase {
    private userRepository: IUserRepository;
    private jwtSecret: string;
    constructor(userRepository: IUserRepository, jwtSecret: string) {
        this.userRepository = userRepository;
        this.jwtSecret = jwtSecret;
    }
    async execute(email: string, password: string) {
        console.log('usecase: ', JSON.stringify({ email, password }))
        const users = await this.userRepository.findAll({ email });
        const user = users[0];
        if (!user) throw new InValidData('Invalid credentials');
        // I did not hash passord for this interview project bacause I did not have enough time to handle creation of users.
        // I will enable ingestion of user using a json file and they will have a plain unhashed passwords hence this
        if (user.password !== password) throw new InValidData('Invalid credentials');
        user.updateLastLogin();
        await this.userRepository.save(user);
        const jti = randomUUID();
        const token = jwt.sign({ id: user.id, email: user.email, jti, role: user.role }, this.jwtSecret, { expiresIn: '1h' });
        return { user: user.toSafeObject(user), token };
    }
}
