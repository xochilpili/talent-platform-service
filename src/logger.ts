import pino from 'pino';

export type ILogger = pino.Logger;
export const Logger = (configs: pino.LoggerOptions) => pino(configs);
