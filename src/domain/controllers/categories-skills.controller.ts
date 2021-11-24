import { injectable } from 'inversify';
import { appContext } from '../../inversify.config';
import { Types } from '../../types';
import { ILogger } from './../../logger';
import { IResponse, HttpStatusCodes } from '../../interfaces/responses';
import { CatCategorySkills } from '../../domain/entities/categories-skills.entity';
import { CatCategorySkillsRepository } from '../repository/cat-category-skills.repository';
import { Errors } from './../../shared/response-errors';

@injectable()
export class CategorySkillsController {
    private readonly logger = appContext.get<ILogger>(Types.Logger);
    private readonly categorySkillsRepository = appContext.get<CatCategorySkillsRepository>(CatCategorySkillsRepository);

    public getCategoriesSkills = async (): Promise<IResponse<CatCategorySkills[]>> => {
        try {
            const categoriesSkills = await this.categorySkillsRepository.getCategorySkills();
            return {
                type: 'success',
                status: HttpStatusCodes.OK,
                message: '',
                result: categoriesSkills,
            };
        } catch (error: Error | unknown) {
            this.logger.error({ error }, `Error getting categories skills`);
			if (error instanceof Error) throw Errors.unexpected(error, this.constructor.name);
			throw error;
        }
    };

    public addCategorySkill = async (description: string): Promise<IResponse<CatCategorySkills>> => {
        try {
            const catsSkills = await this.categorySkillsRepository.addCategorySkill(description);
            return {
                type: 'success',
				status: HttpStatusCodes.CREATED,
				message: '',
				result: catsSkills,
            };
        } catch (error: Error | unknown) {
            this.logger.error({ error }, `Error adding category skill`);
			if (error instanceof Error) throw Errors.unexpected(error, this.constructor.name);
			throw error;
        }
    };

    public updateCategorySkill = async (id: number, description: string): Promise<IResponse<CatCategorySkills>> => {
        try {
            const categorySkill = await this.categorySkillsRepository.updateCategorySkill(id, description);
            return {
                type: 'success',
                status: HttpStatusCodes.OK,
                message: '',
                result: categorySkill,
            };
        } catch (error: Error | unknown) {
            this.logger.error({ error }, `Error updating category skill`);
			if (error instanceof Error) throw Errors.unexpected(error, this.constructor.name);
			throw error;
        }
    };

    public deleteCategorySkill = async (id: number): Promise<IResponse<CatCategorySkills>> => {
        try {
            const categorySkill = await this.categorySkillsRepository.deleteCategorySkill(id);
            return {
				type: 'success',
				status: HttpStatusCodes.OK,
				message: '',
				result: categorySkill,
			};
        } catch (error: Error | unknown) {
            this.logger.error({ error }, `Error deleting category skill`);
			if (error instanceof Error) throw Errors.unexpected(error, this.constructor.name);
			throw error;
        }
    };
  
}