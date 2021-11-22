import { ILogger } from './logger';
import { injectable } from 'inversify';
import { appContext } from './inversify.config';
import { RequestRoute, Server } from '@hapi/hapi';
import { Types } from './types';
import { IRouter } from './interfaces/router';
import { AvailabilitiesRoute } from './app/routes/availabilities.routes';
import { EducationLevelRoute } from './app/routes/education-level.routes';
import { CategoriesSkillsRoute } from './app/routes/categories-skills.routes';

@injectable()
export class Router implements IRouter {
	private logger = appContext.get<ILogger>(Types.Logger);
	private availabilitiesRoutes = appContext.get<AvailabilitiesRoute>(AvailabilitiesRoute);
	private educationLevelRoutes = appContext.get<EducationLevelRoute>(EducationLevelRoute);
	private categoriesSkillsRoutes = appContext.get<CategoriesSkillsRoute>(CategoriesSkillsRoute);

	public async loadRoutes(server: Server): Promise<void> {
		this.logger.info('Registering Routes');
		// the routes
		await this.availabilitiesRoutes.loadRoutes(server);
		await this.educationLevelRoutes.loadRoutes(server);
		await this.categoriesSkillsRoutes.loadRoutes(server);

		this.logger.info(`Routes Registered`);
		server.table().forEach((route: RequestRoute) => this.logger.info(`${route.method} -> ${route.path}`));
	}
}
