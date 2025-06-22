import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';
import { ListUsersUseCase } from '../../application/user/ListUsersUseCase.ts';
import { GetUserDetailsUseCase } from '../../application/user/GetUserDetailsUseCase.ts';
import { CreateUserUseCase } from '../../application/user/CreateUserUseCase.ts';
import { MongoDBUserRepository } from '../../infrastructure/repositories/userRepository.ts';
import { mongoDBProvider } from '../../infrastructure/database/index.ts';

const userRepository = new MongoDBUserRepository(mongoDBProvider.connection, mongoDBProvider.models.User);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const getUserDetailsUseCase = new GetUserDetailsUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);

const userController = new UserController(listUsersUseCase, getUserDetailsUseCase, createUserUseCase);

const router = Router({ mergeParams: true, caseSensitive: true });

router.get('/', (req, res, next) => userController.list(req, res, next));
router.get('/:id', (req, res, next) => userController.details(req, res, next));
router.post('/', (req, res, next) => userController.create(req, res, next));

export default router;
