import { Server } from '@hapi/hapi';
import { injectable } from 'inversify';
import { appContext } from '../../inversify.config';
import { IRouter } from '../../interfaces/router';
import { get as getConfig } from '../../config';
import Joi from 'joi';
import { AvailabilitiesHandler } from '../handlers/availabilities.handler';

@injectable()
export class AvailabilitiesRoute implements IRouter {
	private apiVersion = getConfig('/service/apiVersion');
	private availabilityHandler = appContext.get<AvailabilitiesHandler>(AvailabilitiesHandler);

	async loadRoutes(server: Server): Promise<void> {
		server.route({
			method: 'GET',
			path: `/${this.apiVersion}/availabilities`,
			handler: this.availabilityHandler.getAvailabilities,
		});

		server.route({
			method: 'POST',
			path: `/${this.apiVersion}/availability`,
			handler: this.availabilityHandler.addAvailability,
			options: {
				validate: {
					payload: {
						description: Joi.string().required(),
					},
				},
			},
		});
	}
}
