import { Server } from '@hapi/hapi';
import { injectable } from 'inversify';
import { appContext } from '../../inversify.config';
import { IRouter } from '../../interfaces/router';
import { get as getConfig } from '../../config';
import Joi from 'joi';
import { CategoriesSkillsHandler } from '../handlers/categories-skills.handler';

@injectable()
export class CategoriesSkillsRoute implements IRouter {
    private apiVersion = getConfig('/service/apiVersion');
    private categorySkillsHandler = appContext.get<CategoriesSkillsHandler>(CategoriesSkillsHandler);

    async loadRoutes(server: Server): Promise<void> {
        server.route({
            method: 'GET',
            path: `/${this.apiVersion}/categories-skills`,
            handler: this.categorySkillsHandler.getCategoriesSkills,
        });

        server.route({
            method: 'POST',
            path: `/${this.apiVersion}/category-skills`,
            handler: this.categorySkillsHandler.addCategorySkill,
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