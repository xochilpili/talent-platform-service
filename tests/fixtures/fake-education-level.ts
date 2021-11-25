import { CatEducationLevel } from './../../src/domain/entities/education-level.entity';
export const fakeEducationLevel: CatEducationLevel = {
	id_education_level: 1,
	description: 'fake-description',
};

export const fakeInvalidPayload: any = {
    fake_property: true,
}

export const fakeValidPayload: any = {
    description: 'fake-description',
}
