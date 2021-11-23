import { injectable } from 'inversify';
import { getConnection } from 'typeorm';
import { CatEducationLevel } from '../entities/education-level.entity';

@injectable()
export class CatEducationLevelRepository {
	public async getEducationLevels(): Promise<CatEducationLevel[]> {
		return getConnection().getRepository(CatEducationLevel).find();
	}

	public async educationLevelExists(description: string): Promise<boolean> {
		const exists = getConnection().getRepository(CatEducationLevel).find({ description: description.toLowerCase() }); // we have to save data in lowerCase
		return !exists;
	}

	public async addEducationLevel(description: string): Promise<CatEducationLevel> {
		const newObject = new CatEducationLevel();
		newObject.description = description;
		return getConnection().getRepository(CatEducationLevel).save(newObject);
	}

	public async updateEducationLevel(id: number, description: string): Promise<CatEducationLevel> {
		const educationLevelObject = await getConnection().getRepository(CatEducationLevel).findOneOrFail(id);
		educationLevelObject.description = description;
		return getConnection().getRepository(CatEducationLevel).save(educationLevelObject);
	}

	public async deleteEducationLevel(id: number): Promise<CatEducationLevel> {
		const educationLevelObject = await getConnection().getRepository(CatEducationLevel).findOneOrFail(id);
		return getConnection().getRepository(CatEducationLevel).remove(educationLevelObject);
	}
}
