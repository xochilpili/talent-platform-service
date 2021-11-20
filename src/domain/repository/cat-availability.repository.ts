import { injectable } from 'inversify';
import { getConnection } from 'typeorm';
import { CatAvailability } from '../entities/availabilities.entity';

@injectable()
export class CatAvailabilityRepository {
	public async getAvailabilities(): Promise<CatAvailability[]> {
		return getConnection().getRepository(CatAvailability).find();
	}

	public async addAvailability(description: string): Promise<CatAvailability> {
		const newObject = new CatAvailability();
		newObject.description = description;
		return getConnection().getRepository(CatAvailability).save(newObject);
	}
}
