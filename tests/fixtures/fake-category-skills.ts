import { CatCategorySkills } from "./../../src/domain/entities/categories-skills.entity";
export const fakeCategorySkill: CatCategorySkills = {
    id_category: 1,
    description: 'fake-description',
};

export const fakeInvalidPayload: any = {
    fake_property: true,
}

export const fakeValidPayload: any = {
    description: 'fake-description',
}
