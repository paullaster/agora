import type { Environment } from '../../types/environment.ts';

const app = {
    name: process.env.APP_NAME,
    environment: process.env.APP_ENV as Environment || 'development',
    timezon: process.env.APP_TZ,
    port: process.env.APP_PORT || 4200,
}

export default app;