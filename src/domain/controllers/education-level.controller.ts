import { injectable } from 'inversify';
import { appContext } from '../../inversify.config';
import { Types } from '../../types';
import { ILogger } from './../../logger';
import { IResponse, HttpStatusCodes } from '../../interfaces/responses';
import { CatEducationLevel } from '../../domain/entities/education-level.entity';
import { CatEducationLevelRepository } from '../repository/cat-education-level.repository';
import { Errors } from './../../shared/response-errors';
import { QueryFailedError, EntityNotFoundError } from 'typeorm'

@injectable()
export class EducationLevelController {
	private readonly logger = appContext.get<ILogger>(Types.Logger);
	private readonly educationLevelRepository = appContext.get<CatEducationLevelRepository>(CatEducationLevelRepository);

	public getEducationLevels = async (): Promise<IResponse<CatEducationLevel[]>> => {
		try {
			const educationLevels = await this.educationLevelRepository.getEducationLevels();
			return {
				type: 'success',
				status: HttpStatusCodes.OK,
				message: '',
				result: educationLevels,
			};
		} catch (error: Error | unknown) {
			this.logger.error({ error }, `Error getting education levels`);
			if (error instanceof Error) throw Errors.unexpected(error, this.constructor.name);
			throw error;
		}
	};

	public addEducationLevel = async (description: string): Promise<IResponse<CatEducationLevel>> => {
		try {
			const educationLevel = await this.educationLevelRepository.addEducationLevel(description);
			return {
				type: 'success',
				status: HttpStatusCodes.CREATED,
				message: '',
				result: educationLevel,
			};
		} catch (error: Error | unknown) {
			if (error instanceof QueryFailedError) {
				throw Errors.conflict({
					message: error.driverError.detail,
					issue: '',
					route: this.constructor.name,
					method: 'addEducationLevel',
					learnMore: '',
				});
			}
			this.logger.error({ error }, `Error creating education level`);
			if (error instanceof Error) throw Errors.unexpected(error, this.constructor.name);
			throw error;
		}
	};

	public updateEducationLevel = async (id: number, description: string): Promise<IResponse<CatEducationLevel>> => {
		try {
			const educationLevel = await this.educationLevelRepository.updateEducationLevel(id, description);
			return {
				type: 'success',
				status: HttpStatusCodes.OK,
				message: '',
				result: educationLevel,
			};
		} catch (error: Error | unknown) {
			if (error instanceof EntityNotFoundError) {
				throw Errors.notFound({
					message: error.message,
					issue: '',
					route: this.constructor.name,
					method: 'addEducationLevel',
					learnMore: '',
				});
			}

			this.logger.error({ error }, `Error updating education level`);
			if (error instanceof Error) throw Errors.unexpected(error, this.constructor.name);
			throw error;
		}
	};

	public deleteEducationLevel = async (id: number): Promise<IResponse<CatEducationLevel>> => {
		try {
			const educationLevel = await this.educationLevelRepository.deleteEducationLevel(id);
			return {
				type: 'success',
				status: HttpStatusCodes.OK,
				message: '',
				result: educationLevel,
			};
		} catch (error: Error | unknown) {
			if (error instanceof EntityNotFoundError) {
				throw Errors.notFound({
					message: error.message,
					issue: '',
					route: this.constructor.name,
					method: 'addEducationLevel',
					learnMore: '',
				});
			}

			this.logger.error({ error }, `Error deleting education level`);
			if (error instanceof Error) throw Errors.unexpected(error, this.constructor.name);
			throw error;
		}
	};
}
