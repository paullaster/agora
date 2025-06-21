export interface ILoggingProvider {
    /**
     * Log a message with optional structured metadata.
     * @param message The log message
     * @param meta Optional structured metadata for business/technical context
     */
    log(message: string, meta?: Record<string, unknown>): void;
    /**
     * Log an error with optional structured metadata.
     * @param message The error message
     * @param meta Optional structured metadata for business/technical context
     */
    error(message: string, meta?: Record<string, unknown>): void;
}