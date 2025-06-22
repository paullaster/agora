import { Router } from 'express';
import { OutletController } from '../controllers/outletController.ts';
import { ListOutletsUseCase } from '../../application/outlet/ListOutletsUseCase.ts';
import { GetOutletDetailsUseCase } from '../../application/outlet/GetOutletDetailsUseCase.ts';
import { CreateOutletUseCase } from '../../application/outlet/CreateOutletUseCase.ts';
import { MongoDBOutletRepository } from '../../infrastructure/repositories/outletRepository.ts';
import { mongoDBProvider } from '../../infrastructure/database/index.ts';

const outletRepository = new MongoDBOutletRepository(mongoDBProvider.connection, mongoDBProvider.models.Outlet);
const listOutletsUseCase = new ListOutletsUseCase(outletRepository);
const getOutletDetailsUseCase = new GetOutletDetailsUseCase(outletRepository);
const createOutletUseCase = new CreateOutletUseCase(outletRepository);

const outletController = new OutletController(listOutletsUseCase, getOutletDetailsUseCase, createOutletUseCase);

const router = Router({ mergeParams: true, caseSensitive: true });

router.get('/', (req, res, next) => outletController.list(req, res, next));
router.get('/:id', (req, res, next) => outletController.details(req, res, next));
router.post('/', (req, res, next) => outletController.create(req, res, next));

export default router;
