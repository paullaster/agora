import type { DB } from '../../types/db.ts';

const config = {
    MONGODB: {
        development: {
            connection_url: process.env.DB_CONNECTION_STR,
        }
    }
}

const dbEnv = process.env.DB as DB;
export default config[dbEnv];