import { pino } from 'pino';
import { join } from 'path';
import type { LoggerOptions } from 'pino';

export interface LoggerFactoryOptions {
    channel: string;
    level: string;
    logDir: string;
    rotation: 'daily' | 'size' | 'none';
    rotationConfig: {
        interval?: string;
        maxSize?: string;
        maxFiles?: string;
    };
    environment: string;
    appName: string;
}

export function createLogger(opts: LoggerFactoryOptions) {
    let transport: LoggerOptions['transport'];
    const baseFile = `${opts.appName}-${opts.channel}`

    if (opts.environment === 'development') {
        transport = {
            target: 'pino-pretty',
            options: { colorize: true }
        };
    } else {
        transport = {
            target: 'pino-roll',
            options: {
                file: join(opts.logDir, baseFile),
                frequency: opts.rotation,
                size: opts.rotationConfig.maxSize,
                dateFormat: 'yyyy-MM-dd',
                mkdir: true,
            }
        };
    }

    return pino({
        level: opts.level,
        transport,
    });
}