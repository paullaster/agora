import app from "./app.ts";
import db from "./db.ts";
import pinoConfig from "./pino.ts";

export default {
    app: app,
    db: db,
    pino: pinoConfig,
}