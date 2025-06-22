export interface DashboardMetrics {
    totalUsers: number;
    totalProducts: number;
    totalContributors: number;
}

export class MetricsService {
    async getDashboardMetrics(): Promise<DashboardMetrics> {
        return {
            totalUsers: 123,
            totalProducts: 45,
            totalContributors: 7,
        };
    }
}
