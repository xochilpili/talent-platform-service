import { injectable } from 'inversify';
import { appContext } from '../../inversify.config';
import { ILogger } from './../../logger';
import { Types } from '../../types';
import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { CategorySkillsController } from '../../domain/controllers/categories-skills.controller';

@injectable()
export class CategoriesSkillsHandler {
    private readonly logger = appContext.get<ILogger>(Types.Logger);
    private readonly categorySkillsController = appContext.get<CategorySkillsController>(CategorySkillsController);

    public getCategoriesSkills = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
        try {
            const response = await this.categorySkillsController.getCategoriesSkills();
            return h.response(response).code(response.status);
        } catch (error: Error | unknown) {
            this.logger.error({ error }, `Error getting categories skills`);
			throw error;
        }
    };

    public addCategorySkill = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
        try {
			const { description } = request.payload as { description: string };
			const response = await this.categorySkillsController.addCategorySkill(description);
			return h.response(response).code(response.status);
		} catch (error: Error | unknown) {
			this.logger.error({ error }, `Error adding category skill`);
			throw error;
		}
    }

    public updateCategorySkill = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
        try {
            const { description } = request.payload as { description: string };
            const { id } = request.params as { id: number };
            const response = await this.categorySkillsController.updateCategorySkill(id, description);
            return h.response(response.result).code(response.status);
        } catch (error: Error | unknown) {
			this.logger.error({ error }, `Error updating category skill`);
			throw error;
		}
    }

    public deleteCategorySkill = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
        try {
            const { id } = request.params as { id: number };
            const response = await this.categorySkillsController.deleteCategorySkill(id);
            return h.response(response.result).code(response.status);
        } catch (error: Error | unknown) {
			this.logger.error({ error }, `Error deleting category skill`);
			throw error;
		}
    }
}