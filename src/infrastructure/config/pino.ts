import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, stat } from 'fs/promises';
import type { Rotation } from '../../types/logger.ts';

const __filename = fileURLToPath(import.meta.url);
const __rootdir = dirname(dirname(dirname(dirname(__filename))));


const ensureLogdir = async (dir: string) => {
    try {
        await stat(dir);

    } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === 'ENOENT') {
            await mkdir(dir, { recursive: true });
        } else {
            throw err;
        }
    }
}

const logDir = join(__rootdir, 'storage', 'logs');
await ensureLogdir(logDir);
const rotation: Rotation = process.env.PINO_LOG_ROTATION as Rotation || 'daily' as Rotation;
const logLevel = process.env.LOG_LEVEL || 'info';


const pinoConfig = {
    level: logLevel,
    logDir,
    rotation,
    rotationConfig: {
        maxSize: process.env.PINO_ROTATION_MAX_SIZE || '10m',
        maxFiles: process.env.PINO_ROTATION_MAX_FILES || '64d',
    },
};

export default pinoConfig;