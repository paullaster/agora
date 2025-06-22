import type { Request, Response, NextFunction } from 'express';
import { MetricsService } from '../../core/services/metricsService.ts';

export class DashboardController {
    private metricsService: MetricsService;
    constructor() {
        this.metricsService = new MetricsService();
    }

    async getDashboardMetrics(_req: Request, res: Response, next: NextFunction) {
        try {
            const metrics = await this.metricsService.getDashboardMetrics();
            res.ApiResponse!.success(metrics, 200, 'Dashboard metrics');
        } catch (err) {
            next(err);
        }
    }
}
