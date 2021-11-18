import { injectable } from 'inversify';
import { appContext } from '../../inversify.config';
import { Types } from '../../types';
import { ILogger } from './../../logger';
import { IResponse, HttpStatusCodes } from '../../interfaces/responses';
import { CatAvailability } from '../../domain/entities/availabilities.entity';
import { CatAvailabilityRepository } from './../repository/cat-availability.repository';
import { Errors } from './../../shared/response-errors';

@injectable()
export class AvailabilityController {
	private readonly logger = appContext.get<ILogger>(Types.Logger);
	private readonly availabilityRepository = appContext.get<CatAvailabilityRepository>(CatAvailabilityRepository);

	public getAvailabilities = async (): Promise<IResponse<CatAvailability[]>> => {
		try {
			const availabilities = await this.availabilityRepository.getAvailabilities();
			return {
				type: 'success',
				status: HttpStatusCodes.OK,
				message: '',
				result: availabilities,
			};
		} catch (error: Error | unknown) {
			this.logger.error({ error }, `Error getting availabilities`);
			if (error instanceof Error) throw Errors.unexpected(error, this.constructor.name);
			throw error;
		}
	};

	public addAvailability = async (description: string): Promise<IResponse<CatAvailability>> => {
		try {
			const avails = await this.availabilityRepository.addAvailability(description);
			return {
				type: 'success',
				status: HttpStatusCodes.CREATED,
				message: '',
				result: avails,
			};
		} catch (error: Error | unknown) {
			this.logger.error({ error }, `Error getting availabilities`);
			if (error instanceof Error) throw Errors.unexpected(error, this.constructor.name);
			throw error;
		}
	};
}
