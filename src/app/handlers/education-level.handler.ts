import { injectable } from 'inversify';
import { appContext } from '../../inversify.config';
import { ILogger } from './../../logger';
import { Types } from '../../types';
import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { EducationLevelController } from '../../domain/controllers/education-level.controller';

@injectable()
export class EducationLevelHandler {
	private readonly logger = appContext.get<ILogger>(Types.Logger);
	private readonly educationLevelController = appContext.get<EducationLevelController>(EducationLevelController);

	public getEducationLevels = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
		try {
			const response = await this.educationLevelController.getEducationLevels();
			return h.response(response.result).code(response.status);
		} catch (error: Error | unknown) {
			this.logger.error({ error }, `Error getting education levels`);
			throw error;
		}
	};

	public addEducationLevel = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
		try {
			const { description } = request.payload as { description: string };
			const response = await this.educationLevelController.addEducationLevel(description);
			return h.response(response.result).code(response.status);
		} catch (error: Error | unknown) {
			this.logger.error({ error }, `Error adding education level`);
			throw error;
		}
	};

    public updateEducationLevel = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
		try {
			const { description } = request.payload as { description: string };
            const { id } = request.params as { id: number };
			const response = await this.educationLevelController.updateEducationLevel(id, description);
			return h.response(response.result).code(response.status);
		} catch (error: Error | unknown) {
			this.logger.error({ error }, `Error adding education level`);
			throw error;
		}
	};

	public deleteEducationLevel = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
		try {
            const { id } = request.params as { id: number };
			const response = await this.educationLevelController.deleteEducationLevel(id);
			return h.response(response.result).code(response.status);
		} catch (error: Error | unknown) {
			this.logger.error({ error }, `Error adding education level`);
			throw error;
		}
	};
}
