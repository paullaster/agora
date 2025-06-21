import app from './app.ts';
import config from './infrastructure/config/index.ts';

const PORT = config.app.port || 4200;

function startServer() {
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} (PID: ${process.pid})`);
    });

    // Graceful shutdown
    const shutdown = () => {
        console.log('Received shutdown signal, closing server...');
        server.close(() => {
            console.log('Server closed gracefully.');
            process.exit(0);
        });
        // Force exit if not closed in 10s
        setTimeout(() => {
            console.error('Force exiting after 10s.');
            process.exit(1);
        }, 10000);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}

startServer();
