import 'reflect-metadata';
import { appContext } from '../../../src/inversify.config';
import Hapi from '@hapi/hapi';
import Server from '../../../src/server';
import { fakeEducationLevel, fakeValidPayload, fakeInvalidPayload } from './../../fixtures/fake-education-level';
import { CatEducationLevel } from '../../../src/domain/entities/education-level.entity';
import { CatEducationLevelRepository } from './../../../src/domain/repository/cat-education-level.repository';
import { get as getConfig } from '../../../src/config';
import { QueryFailedError, EntityNotFoundError } from 'typeorm'


describe('Education Level Controller Test', () => {
	let server: Hapi.Server;
	const apiVersion = getConfig('/service/apiVersion');

	const educationLevelRepository = appContext.get<CatEducationLevelRepository>(CatEducationLevelRepository);

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

	it('should get all education levels', async () => {
		educationLevelRepository.getEducationLevels = jest.fn().mockResolvedValueOnce([fakeEducationLevel]);
		const expected: CatEducationLevel[] = [fakeEducationLevel];
		const data = await server.inject({
			method: 'GET',
			url: `/${apiVersion}/education-level`,
		});

		expect(data.statusCode).toBe(200);

		expect(data.result).toStrictEqual(expected);
	});

	it('should handle error when unexpected error in listing education', async () => {
		educationLevelRepository.getEducationLevels = jest.fn().mockImplementationOnce(() => {
			throw new Error('fake-error');
		});
		const data = await server.inject({
			method: 'GET',
			url: `/${apiVersion}/education-level`,
		});
		expect(data.statusCode).toBe(500);
		expect((data.result as any)['message']).toMatch(/fake-error/);
	});

	it('should return 400 when invalid payload in creating', async () => {
		const data = await server.inject({
			method: 'POST',
			url: `/${apiVersion}/education-level`,
			payload: fakeInvalidPayload,
		});
		expect(data.statusCode).toBe(400);
		expect((data.result as any)['message']).toMatch(/\"description\" is required/);
	});

	it('should handle error when unexpected error in creating education', async () => {
		educationLevelRepository.addEducationLevel = jest.fn().mockImplementationOnce(() => {
			throw new Error('fake-error');
		});
		const data = await server.inject({
			method: 'POST',
			url: `/${apiVersion}/education-level`,
			payload: fakeValidPayload,
		});
		expect(data.statusCode).toBe(500);
		expect((data.result as any)['message']).toMatch(/fake-error/);
	});

	it('should handle error when trying to insert repeated education', async () => {
		educationLevelRepository.addEducationLevel = jest.fn().mockImplementationOnce(() => {
			throw new QueryFailedError('', [], []);
		});

		const data = await server.inject({
			method: 'POST',
			url: `/${apiVersion}/education-level`,
			payload: fakeValidPayload,
		});
		console.log(data)
		expect(data.statusCode).toBe(409);
		expect((data.result as any)['error']).toMatch(/Conflict/);
	});

	it('should add availabilities', async () => {
		educationLevelRepository.addEducationLevel = jest.fn().mockResolvedValueOnce(fakeEducationLevel);
		const expected: CatEducationLevel =  fakeEducationLevel;

		const data = await server.inject({
			method: 'POST',
			url: `/${apiVersion}/education-level`,
			payload: fakeValidPayload,
		});
		expect(data.statusCode).toBe(201);
		expect(data.result).toStrictEqual(expected);
	});

	it('should handle error when updating education level that not exists', async () => {
		educationLevelRepository.updateEducationLevel = jest.fn().mockImplementationOnce(() => {
			throw new EntityNotFoundError(CatEducationLevel, {});
		});

		const data = await server.inject({
			method: 'PUT',
			url: `/${apiVersion}/education-level/1`,
			payload: fakeValidPayload,
		});
		console.log(data)
		expect(data.statusCode).toBe(404);
		expect((data.result as any)['error']).toMatch(/Not Found/);
	});

	it('should return 400 when invalid payload in updating', async () => {
		const data = await server.inject({
			method: 'PUT',
			url: `/${apiVersion}/education-level/1`,
			payload: fakeInvalidPayload,
		});
		expect(data.statusCode).toBe(400);
		expect((data.result as any)['message']).toMatch(/\"description\" is required/);
	});

	it('should handle error when unexpected error in updating education', async () => {
		educationLevelRepository.updateEducationLevel = jest.fn().mockImplementationOnce(() => {
			throw new Error('fake-error');
		});
		const data = await server.inject({
			method: 'PUT',
			url: `/${apiVersion}/education-level/1`,
			payload: fakeValidPayload,
		});
		expect(data.statusCode).toBe(500);
		expect((data.result as any)['message']).toMatch(/fake-error/);
	});

	it('should update successfully education level', async () => {
		educationLevelRepository.updateEducationLevel = jest.fn().mockResolvedValueOnce(fakeEducationLevel);
		const expected: CatEducationLevel =  fakeEducationLevel;

		const data = await server.inject({
			method: 'PUT',
			url: `/${apiVersion}/education-level/1`,
			payload: fakeValidPayload,
		});
		expect(data.statusCode).toBe(200);
		expect(data.result).toStrictEqual(expected);
	});

	it('should handle error when deleting education level that not exists', async () => {
		educationLevelRepository.deleteEducationLevel = jest.fn().mockImplementationOnce(() => {
			throw new EntityNotFoundError(CatEducationLevel, {});
		});

		const data = await server.inject({
			method: 'DELETE',
			url: `/${apiVersion}/education-level/1`,
		});
		console.log(data)
		expect(data.statusCode).toBe(404);
		expect((data.result as any)['error']).toMatch(/Not Found/);
	});

	it('should handle error when unexpected error in deleting education', async () => {
		educationLevelRepository.deleteEducationLevel = jest.fn().mockImplementationOnce(() => {
			throw new Error('fake-error');
		});
		const data = await server.inject({
			method: 'DELETE',
			url: `/${apiVersion}/education-level/1`,
		});
		expect(data.statusCode).toBe(500);
		expect((data.result as any)['message']).toMatch(/fake-error/);
	});

	it('should delete successfully education level', async () => {
		educationLevelRepository.deleteEducationLevel = jest.fn().mockResolvedValueOnce(fakeEducationLevel);
		const expected: CatEducationLevel =  fakeEducationLevel;

		const data = await server.inject({
			method: 'DELETE',
			url: `/${apiVersion}/education-level/1`,
		});
		expect(data.statusCode).toBe(200);
		expect(data.result).toStrictEqual(expected);
	});
});
