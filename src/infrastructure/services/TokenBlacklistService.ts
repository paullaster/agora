/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ILoggingProvider } from '../../core/providers/ILoggingProvider.ts';
import { createClient } from 'redis';

export class TokenBlacklistService {
    private client;
    constructor(client: any) {
        this.client = client;
    }
    static async init(logger: ILoggingProvider) {
        const client = await createClient()
            .on('error', (err: any) => logger.error("Redis Client Error. " + err.message))
            .connect();
        return new TokenBlacklistService(client)
    }
    async blacklistToken(jti: string, expiresInSeconds: number): Promise<void> {
        await this.client.set(`blacklist:${jti}`, '1', { EX: expiresInSeconds });
    }

    async isTokenBlacklisted(jti: string): Promise<boolean> {
        const result = await this.client.get(`blacklist:${jti}`);
        return result === '1';
    }
    destroyRedisClient() {
        this.client.destroy();
    }
}
