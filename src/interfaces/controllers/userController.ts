import type { Request, Response, NextFunction } from 'express';
import { ListUsersUseCase } from '../../application/user/ListUsersUseCase.ts';
import { GetUserDetailsUseCase } from '../../application/user/GetUserDetailsUseCase.ts';
import { CreateUserUseCase } from '../../application/user/CreateUserUseCase.ts';

export class UserController {
    private listUsersUseCase: ListUsersUseCase;
    private getUserDetailsUseCase: GetUserDetailsUseCase;
    private createUserUseCase: CreateUserUseCase;

    constructor(
        listUsersUseCase: ListUsersUseCase,
        getUserDetailsUseCase: GetUserDetailsUseCase,
        createUserUseCase: CreateUserUseCase
    ) {
        this.listUsersUseCase = listUsersUseCase;
        this.getUserDetailsUseCase = getUserDetailsUseCase;
        this.createUserUseCase = createUserUseCase;
    }

    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.listUsersUseCase.execute(req.query);
            res.ApiResponse!.success(users);
        } catch (error) {
            next(error);
        }
    }

    async details(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.getUserDetailsUseCase.execute(req.params.id);
            if (!user) return res.ApiResponse!.error(404, 'User not found');
            res.ApiResponse!.success(user);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.createUserUseCase.execute(req.body);
            res.ApiResponse!.success(user, 201, 'User created');
        } catch (error) {
            next(error);
        }
    }
}
