import express from 'express';
import promClient from 'prom-client';
import { setRoutes } from './interfaces/routes/index.ts';
import { errorHandler } from './interfaces/controllers/errorHandler.ts';
import { ApiResponder } from './interfaces/middleware/apiResponder.ts';

const app = express();

app.use(express.json({ limit: '8192mb', strict: true }));
app.use(express.urlencoded({ extended: true, limit: '8192mb' }));

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [50, 100, 200, 300, 400, 500, 1000, 2000, 5000],
});

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        httpRequestDurationMicroseconds
            .labels(req.method, req.route ? req.route.path : req.path, res.statusCode.toString())
            .observe(duration);
    });
    next();
});

app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

app.use(ApiResponder);
setRoutes(app);
app.use(errorHandler);


export default app;