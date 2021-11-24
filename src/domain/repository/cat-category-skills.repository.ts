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

    public async updateCategorySkill(id: number, description: string): Promise<CatCategorySkills> {
        const categorySkillObject = await getConnection().getRepository(CatCategorySkills).findOneOrFail(id);
        categorySkillObject.description = description;
        return getConnection().getRepository(CatCategorySkills).save(categorySkillObject);
    }

    public async deleteCategorySkill(id: number): Promise<CatCategorySkills> {
        const categorySkillObject = await getConnection().getRepository(CatCategorySkills).findOneOrFail(id);
        return getConnection().getRepository(CatCategorySkills).remove(categorySkillObject);
    }
}