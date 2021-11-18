import { DatabaseService } from './database';
import { appContext } from './inversify.config';
import { Types } from './types';
import { ILogger } from './logger';
import { IRouter } from './interfaces/router';
import * as Plugins from './plugins';
import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Joi from 'joi';
import { get as getConfig } from './config';

export default class Server {
	private static logger = appContext.get<ILogger>(Types.Logger);
	private static routes = appContext.get<IRouter>(Types.Router);
	private static databaseService = appContext.get<DatabaseService>(DatabaseService);
	private static _instance: Hapi.Server;

	public static async start(): Promise<Hapi.Server> {
		try {
			this._instance = new Hapi.Server({
				host: getConfig('/service/host'),
				port: getConfig('/service/port'),
				routes: {
					validate: {
						options: {
							abortEarly: false,
						},
						failAction: async (_request, _response, err) => {
							this.logger.error({ err }, ' Request validation error.');
							throw Boom.badRequest(err?.message);
						},
					},
					cors: {
						origin: ['*'], // restrict when it's necessary
						headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
						additionalHeaders: ['cache-control', 'x-requested-with', 'authorization'], // added semanthic headers... Notice about security headers.
					},
				},
			});

			// adding Joi default validator
			this._instance.validator(Joi);

			await new Plugins.LoggerLoader().register(this._instance);
			await new Plugins.SwaggerLoader().register(this._instance);
			await new Plugins.SecureHeaderLoader().register(this._instance);
			await new Plugins.SentryLoader().register(this._instance);

			await this.routes.loadRoutes(this._instance);
			await this._instance.start();
			await this.databaseService.getConnection();
			this.logger.info(`App started at port=${getConfig('/service/port')}`);

			return this._instance;
		} catch (error: Error | unknown) {
			this.logger.error({ error }, `Something went wrong starting the server`);
			throw error;
		}
	}

	public static async stop(): Promise<void> {
		this.logger.info(`Server - Stopping execution`);
		await this._instance.stop();
		await this.databaseService.closeConnection();
	}
}
