import type { ModelMap, SchemaMap } from '../../../types/db.ts';
import type { IDatabaseProvider } from '../../../core/providers/IDatabaseProvider.ts';
import type { Connection } from 'mongoose';
import config from '../../config/index.ts';
import {
    // Connection,
    // connection as mongooseConnection,
    createConnection as mongooseConnection,
    set as mongooseSet
} from 'mongoose';

export class MongoDBDatabaseProvider implements IDatabaseProvider {
    public connection: Connection;
    public models: ModelMap;
    private constructor(connection: Connection, models: ModelMap) {
        this.connection = connection;
        this.models = models;
    }
    static async create(schemas: SchemaMap): Promise<MongoDBDatabaseProvider> {
        const environment = (config.app.environment as keyof typeof config.db) || 'development';
        const dbConfig = config.db;
        const connectionUrl = dbConfig?.[environment]?.connection_url;
        if (!connectionUrl) throw new Error('No MongoDB connection string found for environment: ' + environment);

        mongooseSet('strictQuery', false);
        let conn;
        try {
            conn = await mongooseConnection(connectionUrl, {
                maxPoolSize: 50,
                serverSelectionTimeoutMS: 10000000,
                socketTimeoutMS: 45000,
            }).asPromise();
            if (conn.readyState !== 1) {
                throw new Error('Failed to connect to MongoDB:');
            } else {
                console.log('Database connection established successfully');
            }
        } catch (err) {
            console.error('MongoDB connection error:', err);
            throw err;
        }

        const models: ModelMap = {};
        for (const [name, schema] of Object.entries(schemas)) {
            if (conn.models[name]) {
                models[name] = conn.models[name];
            } else {
                models[name] = conn.model(name, schema);
            }
        }
        return new MongoDBDatabaseProvider(conn, models);
    }
}