import { injectable } from 'inversify';
import { getCustomRepository } from 'typeorm';
/*
	METHOD: 1
		If you're using connection object use this : 
import { appContext } from '../../inversify.config';
import { Types } from '../../types';
import { IDatabase } from './../../interfaces/database';

*/
import { CatAvailability, CatAvailabilityService } from './../entities/availabilities.entity';

@injectable()
export class CatAvailabilityRepository {
	// METHOD: 1
	// private readonly databaseService: IDatabase = appContext.get<IDatabase>(Types.DatabaseService);
	public async getAvailabilities(): Promise<CatAvailability[]> {
		// METHOD 1
		// const repoService = await this.databaseService.getRepository(CatAvailabilityService);
		// const availabilities = await repoService.find();

		const repository = getCustomRepository(CatAvailabilityService);
		const avails = await repository.find();
		return avails;
	}

	public async addAvailability(description: string): Promise<CatAvailability> {
		const repo = getCustomRepository(CatAvailabilityService);
		const newAvail = new CatAvailability(); // this way sucks
		newAvail.description = description;
		return await repo.save(newAvail);
	}
}
