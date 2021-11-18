import { Server } from '@hapi/hapi';
import { appContext } from '../inversify.config';
import { ILogger } from '../logger';
import { Types } from '../types';
import { get as configGet } from '../config';

export class LoggerLoader {
	private logger = appContext.get<ILogger>(Types.Logger);

	register = async (server: Server): Promise<void> => {
		try {
			const logEvents = configGet('/logger/events');

			await server.register({
				options: {
					instance: this.logger,
					logEvents: logEvents,
				},
				plugin: require('hapi-pino'),
			});
			this.logger.info('Plugin Logger Registered');
		} catch (error) {
			this.logger.error({ error }, 'Error Loading Logger Plugin');
		}
	};
}
