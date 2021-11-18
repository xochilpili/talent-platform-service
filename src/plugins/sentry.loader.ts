import { Server } from '@hapi/hapi';
import { appContext } from '../inversify.config';
import { ILogger } from '../logger';
import { Types } from '../types';
import { get as configGet } from '../config';

export class SentryLoader {
	private logger = appContext.get<ILogger>(Types.Logger);

	async register(server: Server): Promise<void> {
		// Disable Hapi Sentry in Local Environment
		if (configGet('/env') === 'development') {
			this.logger.info('Skipping Hapi Sentry in Local Environment');
			return;
		}

		try {
			await server.register({
				plugin: require('hapi-sentry'),
				options: {
					client: {
						dsn: configGet('/sentry/dsn'),
						sampleRate: configGet('/sentry/traceRate'),
						environment: configGet('/env'),
					},
					catchLogErrors: true,
				},
			});
			this.logger.info('Plugin Sentry Registered');
		} catch (error) {
			this.logger.error({ error }, 'Error Loading Plugin Sentry');
		}
	}
}
