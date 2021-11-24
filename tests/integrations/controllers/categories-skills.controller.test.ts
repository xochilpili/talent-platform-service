import 'reflect-metadata';
import { appContext } from '../../../src/inversify.config';
import Hapi from '@hapi/hapi';
import Server from '../../../src/server';
import { IResponse } from './../../../src/interfaces/responses';
import { fakeCategorySkill, fakeInvalidPayload, fakeValidPayload } from './../../fixtures/fake-category-skills';
import { CatCategorySkills } from '../../../src/domain/entities/categories-skills.entity';
import { CatCategorySkillsRepository } from './../../../src/domain/repository/cat-category-skills.repository';
import { get as getConfig } from '../../../src/config';
import { QueryFailedError, EntityNotFoundError } from 'typeorm'

describe('Categories Skills Controller Test', () => {
    let server: Hapi.Server;
	const apiVersion = getConfig('/service/apiVersion');

	const categorySkillRepository = appContext.get<CatCategorySkillsRepository>(CatCategorySkillsRepository);

	beforeAll(async () => {
		process.env.ENV = 'tests';
		server = await Server.start();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	afterAll(async () => {
		await Server.stop();
	});

	it('should get all categories skills', async() => {
		categorySkillRepository.getCategorySkills = jest.fn().mockResolvedValueOnce([fakeCategorySkill]);
		const expected: IResponse<CatCategorySkills[]> = {
			type: 'success',
			status: 200,
			message: '',
			result: [fakeCategorySkill],
		};
		const data = await server.inject({
			method: 'GET',
			url: `/${apiVersion}/categories-skills`,
		});

		expect(data.statusCode).toBe(200);

		expect(data.result).toStrictEqual(expected);
	});

	it('should handle error when unexpected error in listing category skill', async () => {
		categorySkillRepository.getCategorySkills = jest.fn().mockImplementationOnce(() => {
			throw new Error('fake-error');
		});
		const data = await server.inject({
			method: 'GET',
			url: `/${apiVersion}/categories-skills`,
		});
		expect(data.statusCode).toBe(500);
		expect((data.result as any)['message']).toMatch(/fake-error/);
	});

	it('should return 400 when invalid payload in creating', async () => {
		const data = await server.inject({
			method: 'POST',
			url: `/${apiVersion}/categories-skills`,
			payload: fakeInvalidPayload,
		});
		expect(data.statusCode).toBe(400);
		expect((data.result as any)['message']).toMatch(/\"description\" is required/);
	});

	it('should handle error when unexpected error in creating category skill', async () => {
		categorySkillRepository.addCategorySkill = jest.fn().mockImplementationOnce(() => {
			throw new Error('fake-error');
		});
		const data = await server.inject({
			method: 'POST',
			url: `/${apiVersion}/categories-skills`,
			payload: fakeValidPayload,
		});
		expect(data.statusCode).toBe(500);
		expect((data.result as any)['message']).toMatch(/fake-error/);
	});

	it('should handle error when trying to insert repeated category skill', async () => {
		categorySkillRepository.addCategorySkill = jest.fn().mockImplementationOnce(() => {
			throw new QueryFailedError('', [], []);
		});

		const data = await server.inject({
			method: 'POST',
			url: `/${apiVersion}/categories-skills`,
			payload: fakeValidPayload,
		});
		console.log(data)
		expect(data.statusCode).toBe(409);
		expect((data.result as any)['error']).toMatch(/Conflict/);
	});

	it('should add categories skills', async () => {
		categorySkillRepository.addCategorySkill = jest.fn().mockResolvedValueOnce(fakeCategorySkill);
		const expected: IResponse<CatCategorySkills> = {
			type: 'success',
			status: 201,
			message: '',
			result: { ...fakeCategorySkill },
		};

		const data = await server.inject({
			method: 'POST',
			url: `/${apiVersion}/categories-skills`,
			payload: fakeValidPayload,
		});
		expect(data.statusCode).toBe(201);
		expect(data.result).toStrictEqual(expected);
	});

	it('should handle error when updating category skill that not exists', async () => {
		categorySkillRepository.updateCategorySkill = jest.fn().mockImplementationOnce(() => {
			throw new EntityNotFoundError(CatCategorySkills, {});
		});

		const data = await server.inject({
			method: 'PUT',
			url: `/${apiVersion}/categories-skills/1`,
			payload: fakeValidPayload,
		});
		console.log(data)
		expect(data.statusCode).toBe(404);
		expect((data.result as any)['error']).toMatch(/Not Found/);
	});

	it('should return 400 when invalid payload in updating', async () => {
		const data = await server.inject({
			method: 'PUT',
			url: `/${apiVersion}/categories-skills/1`,
			payload: fakeInvalidPayload,
		});
		expect(data.statusCode).toBe(400);
		expect((data.result as any)['message']).toMatch(/\"description\" is required/);
	});

	it('should handle error when unexpected error in updating education', async () => {
		categorySkillRepository.updateCategorySkill = jest.fn().mockImplementationOnce(() => {
			throw new Error('fake-error');
		});
		const data = await server.inject({
			method: 'PUT',
			url: `/${apiVersion}/categories-skills/1`,
			payload: fakeValidPayload,
		});
		expect(data.statusCode).toBe(500);
		expect((data.result as any)['message']).toMatch(/fake-error/);
	});

	it('should update successfully category skill', async () => {
		categorySkillRepository.updateCategorySkill = jest.fn().mockResolvedValueOnce(fakeCategorySkill);
		const expected: CatCategorySkills =  fakeCategorySkill;

		const data = await server.inject({
			method: 'PUT',
			url: `/${apiVersion}/categories-skills/1`,
			payload: fakeValidPayload,
		});
		expect(data.statusCode).toBe(200);
		expect(data.result).toStrictEqual(expected);
	});

	it('should handle error when deleting category skill that not exists', async () => {
		categorySkillRepository.deleteCategorySkill = jest.fn().mockImplementationOnce(() => {
			throw new EntityNotFoundError(CatCategorySkills, {});
		});

		const data = await server.inject({
			method: 'DELETE',
			url: `/${apiVersion}/categories-skills/1`,
		});
		console.log(data)
		expect(data.statusCode).toBe(404);
		expect((data.result as any)['error']).toMatch(/Not Found/);
	});

	it('should handle error when unexpected error in deleting category skill', async () => {
		categorySkillRepository.deleteCategorySkill = jest.fn().mockImplementationOnce(() => {
			throw new Error('fake-error');
		});
		const data = await server.inject({
			method: 'DELETE',
			url: `/${apiVersion}/categories-skills/1`,
		});
		expect(data.statusCode).toBe(500);
		expect((data.result as any)['message']).toMatch(/fake-error/);
	});

	it('should delete successfully category skill', async () => {
		categorySkillRepository.deleteCategorySkill = jest.fn().mockResolvedValueOnce(fakeCategorySkill);
		const expected: CatCategorySkills =  fakeCategorySkill;

		const data = await server.inject({
			method: 'DELETE',
			url: `/${apiVersion}/categories-skills/1`,
		});
		expect(data.statusCode).toBe(200);
		expect(data.result).toStrictEqual(expected);
	});
});