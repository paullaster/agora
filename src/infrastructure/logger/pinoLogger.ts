import type { ILoggingProvider } from '../../core/providers/ILoggingProvider.ts';
import { createLogger } from './loggerFactory.ts';
import config from '../config/index.ts';

export class PinoLogger implements ILoggingProvider {
    private logger;
    private level: string;
    private channel: string;
    constructor(channel: string = 'app') {
        this.level = config.pino.level;
        this.channel = channel;
        this.logger = createLogger({
            channel,
            level: this.level,
            logDir: config.pino.logDir,
            rotation: config.pino.rotation,
            rotationConfig: config.pino.rotationConfig,
            environment: config.app.environment,
            appName: config.app.name!,
        });
    }

    log(message: string, meta?: Record<string, unknown>): void {
        // Route to the correct log level based on config
        switch (this.level) {
            case 'fatal':
                this.logger.fatal({ channel: this.channel, ...meta }, message);
                break;
            case 'error':
                this.logger.error({ channel: this.channel, ...meta }, message);
                break;
            case 'warn':
                this.logger.warn({ channel: this.channel, ...meta }, message);
                break;
            case 'info':
                this.logger.info({ channel: this.channel, ...meta }, message);
                break;
            case 'debug':
                this.logger.debug({ channel: this.channel, ...meta }, message);
                break;
            case 'trace':
                this.logger.trace({ channel: this.channel, ...meta }, message);
                break;
            default:
                this.logger.info({ channel: this.channel, ...meta }, message);
        }
    }

    error(message: string, meta?: Record<string, unknown>): void {
        this.logger.error({ channel: this.channel, ...meta }, message);
    }
}
