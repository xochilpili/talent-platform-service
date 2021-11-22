import { injectable } from 'inversify';
import { getConnection } from 'typeorm';
import { CatCategorySkills } from '../entities/categories-skills.entity';

@injectable()
export class CatCategorySkillsRepository {
    public async getCategorySkills(): Promise<CatCategorySkills[]> {
        return getConnection().getRepository(CatCategorySkills).find();
    }

    public async addCategorySkill(description: string): Promise<CatCategorySkills> {
        const newObject = new CatCategorySkills();
        newObject.description = description;
        return getConnection().getRepository(CatCategorySkills).save(newObject);
    }

}