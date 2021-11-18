import { Server } from '@hapi/hapi';
import { appContext } from '../inversify.config';
import { ILogger } from '../logger';
import { Types } from '../types';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';

export class SwaggerLoader {
	private logger = appContext.get<ILogger>(Types.Logger);

	register = async (server: Server): Promise<void> => {
		try {
			await server.register([
				{
					plugin: Inert,
				},
				{
					plugin: Vision,
				},
				{
					plugin: HapiSwagger,
					options: {
						info: {
							title: 'Talent Platform API Service',
						},
					},
				},
			]);

			this.logger.info('Plugin Swagger Registered');
		} catch (error) {
			this.logger.error({ error }, 'Error Loading Swagger Plugin');
		}
	};
}
