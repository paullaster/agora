import type { Request, Response, NextFunction } from 'express';
import { ListOutletsUseCase } from '../../application/outlet/ListOutletsUseCase.ts';
import { GetOutletDetailsUseCase } from '../../application/outlet/GetOutletDetailsUseCase.ts';
import { CreateOutletUseCase } from '../../application/outlet/CreateOutletUseCase.ts';

export class OutletController {
    private listOutletsUseCase: ListOutletsUseCase;
    private getOutletDetailsUseCase: GetOutletDetailsUseCase;
    private createOutletUseCase: CreateOutletUseCase;

    constructor(
        listOutletsUseCase: ListOutletsUseCase,
        getOutletDetailsUseCase: GetOutletDetailsUseCase,
        createOutletUseCase: CreateOutletUseCase
    ) {
        this.listOutletsUseCase = listOutletsUseCase;
        this.getOutletDetailsUseCase = getOutletDetailsUseCase;
        this.createOutletUseCase = createOutletUseCase;
    }

    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const outlets = await this.listOutletsUseCase.execute(req.query);
            res.ApiResponse!.success(outlets);
        } catch (error) {
            next(error);
        }
    }

    async details(req: Request, res: Response, next: NextFunction) {
        try {
            const outlet = await this.getOutletDetailsUseCase.execute(req.params.id);
            if (!outlet) return res.ApiResponse!.error(404, 'Outlet not found');
            res.ApiResponse!.success(outlet);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const outlet = await this.createOutletUseCase.execute(req.body);
            res.ApiResponse!.success(outlet, 201, 'Outlet created');
        } catch (error) {
            next(error);
        }
    }
}
