import { injectable } from 'inversify';
import { appContext } from '../../inversify.config';
import { ILogger } from './../../logger';
import { Types } from '../../types';
import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { AvailabilityController } from '../../domain/controllers/availabilities.controller';

@injectable()
export class AvailabilitiesHandler {
	private readonly logger = appContext.get<ILogger>(Types.Logger);
	private readonly availabilityController = appContext.get<AvailabilityController>(AvailabilityController);

	public getAvailabilities = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
		try {
			const response = await this.availabilityController.getAvailabilities();
			return h.response(response).code(response.status);
		} catch (error: Error | unknown) {
			this.logger.error({ error }, `Error getting availabilities`);
			throw error;
		}
	};

	public addAvailability = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
		try {
			const { description } = request.payload as { description: string };
			const response = await this.availabilityController.addAvailability(description);
			return h.response(response).code(response.status);
		} catch (error: Error | unknown) {
			this.logger.error({ error }, `Error adding availabilities`);
			throw error;
		}
	};
}
