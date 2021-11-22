import { Server } from '@hapi/hapi';
import { injectable } from 'inversify';
import { appContext } from '../../inversify.config';
import { IRouter } from '../../interfaces/router';
import { get as getConfig } from '../../config';
import Joi from 'joi';
import { EducationLevelHandler } from '../handlers/education-level.handler';

@injectable()
export class EducationLevelRoute implements IRouter {
	private apiVersion = getConfig('/service/apiVersion');
	private educationLevelHandler = appContext.get<EducationLevelHandler>(EducationLevelHandler);

	async loadRoutes(server: Server): Promise<void> {
		server.route({
			method: 'GET',
			path: `/${this.apiVersion}/education-level`,
			handler: this.educationLevelHandler.getEducationLevels,
		});

		server.route({
			method: 'POST',
			path: `/${this.apiVersion}/education-level`,
			handler: this.educationLevelHandler.addEducationLevel,
			options: {
				validate: {
					payload: {
						description: Joi.string().required(),
					},
				},
			},
		});

        server.route({
			method: 'PUT',
			path: `/${this.apiVersion}/education-level/{id}`,
			handler: this.educationLevelHandler.updateEducationLevel,
			options: {
				validate: {
					payload: {
						description: Joi.string().required(),
					},
				},
			},
		});

		server.route({
			method: 'DELETE',
			path: `/${this.apiVersion}/education-level/{id}`,
			handler: this.educationLevelHandler.deleteEducationLevel,
		});
	}
}
