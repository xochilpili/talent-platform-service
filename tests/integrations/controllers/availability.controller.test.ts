import 'reflect-metadata';
import { appContext } from '../../../src/inversify.config';
import Hapi from '@hapi/hapi';
import Server from '../../../src/server';
import { IResponse } from './../../../src/interfaces/responses';
import { fakeAvailability } from './../../fixtures/fake-availabilities';
import { CatAvailability } from '../../../src/domain/entities/availabilities.entity';
import { CatAvailabilityRepository } from './../../../src/domain/repository/cat-availability.repository';
import { get as getConfig } from '../../../src/config';
/*

Note: All this commented blocks, are because i wanted to mock the entire: TypeORM ConnectionObject, but seems to be impossible due a inconsistency documentation about types/interface & unit-testings -
	--  TypeORM objects (i've discovered) ---
	1.- Connection
	2.- ConnectionManager
		- getConnection
		- getManager
	3.- Repository
		- getCustomRespository
		- getRepository
	4.- There's no way to mock Connection without all the chain - getConnection.getRepository(TheRepo).save() < as we have this in our repository class, "in the right way, since it's not documented. Also there's a PR --rejected-- in TypeORM gitRepo",

	Should be hackable, but is not a proper way to do it.
	Thus, googling a little bit, seems that TypeORM was espefificaly made to run along NestJS, therefor, there's no way to use @InjectProvider decorator, and that's the hackish part using inversify.

	A; So, this is the actual process that this test is doing:
		1.- Disable the connection part using process.env.ENV !=== 'tests' when we're testing
		2.- Mock our Repository methods, such as: 
			- getAvailabilities
			- addAvailabilities
	
	Hope, to be clear enough just to clear understanding about what's the issue here.

	B; Another option as many other community developers is to use e2e which means:
		1.- Seed Database with dumb data
		2.- Test with a real connection in a `test` database `replica`
	
	C: Last option, is to enable those databases that are called `in-memory` which actually create instences in memory aloong unit-test/integration tests

import typeorm, { createConnection } from 'typeorm';
import { DatabaseService } from './../../../src/database';
import { IDatabase } from './../../../src/interfaces/database';
import { Types } from '../../../src/types';
*/

describe('Availability Controller Test', () => {
	let server: Hapi.Server;
	const apiVersion = getConfig('/service/apiVersion');
	/*
	
	const mockedTypeorm = typeorm as jest.Mocked<typeof typeorm>;
	const databaseService = appContext.get<IDatabase>(Types.DatabaseService);
	mock availabilitiesRepository
	
	*/
	const availabilitiesRepository = appContext.get<CatAvailabilityRepository>(CatAvailabilityRepository);

	/*
	
	jest.mock('typeorm', () => ({
		createConnection: jest.fn(),
		getCustomRepository: jest.fn(),
		getConnection: jest.fn().mockImplementationOnce(() => ({
			getRepository: jest.fn().mockImplementation((...args) => ({
				save: jest.fn().mockResolvedValue(args),
			})),
		})),
		Connection: jest.fn().mockImplementation(() => ({
			close: jest.fn(),
		})),
	}));
	
	*/

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

	it('should get availabilities', async () => {
		availabilitiesRepository.getAvailabilities = jest.fn().mockResolvedValueOnce([fakeAvailability]);
		const expected: IResponse<CatAvailability[]> = {
			type: 'success',
			status: 200,
			message: '',
			result: [fakeAvailability],
		};
		const data = await server.inject({
			method: 'GET',
			url: `/${apiVersion}/availabilities`,
		});
		expect(data.statusCode).toBe(200);

		expect(data.result).toStrictEqual(expected);
	});

	it('should thrown an error when no availabilities', async () => {
		availabilitiesRepository.getAvailabilities = jest.fn().mockImplementationOnce(() => {
			throw new Error('fake-error');
		});
		const data = await server.inject({
			method: 'GET',
			url: `/${apiVersion}/availabilities`,
		});
		expect(data.statusCode).toBe(500);
		expect((data.result as any)['message']).toMatch(/fake-error/);
	});

	it('should return 400 when invalid payload', async () => {
		const data = await server.inject({
			method: 'POST',
			url: `/${apiVersion}/availability`,
			payload: {
				invalidObject: 'fake',
			},
		});
		expect(data.statusCode).toBe(400);
		expect((data.result as any)['message']).toMatch(/invalidObject/);
	});

	it('should thrown an error when adding availabilities', async () => {
		availabilitiesRepository.addAvailability = jest.fn().mockImplementationOnce(() => {
			throw new Error('fake-error');
		});

		const data = await server.inject({
			method: 'POST',
			url: `/${apiVersion}/availability`,
			payload: {
				description: 'fake-description',
			},
		});
		expect(data.statusCode).toBe(500);
		expect((data.result as any)['message']).toMatch(/fake-error/);
	});

	it('should add availabilities', async () => {
		availabilitiesRepository.addAvailability = jest.fn().mockResolvedValueOnce(fakeAvailability);
		const expected: IResponse<CatAvailability> = {
			type: 'success',
			status: 201,
			message: '',
			result: { ...fakeAvailability },
		};

		const data = await server.inject({
			method: 'POST',
			url: `/${apiVersion}/availability`,
			payload: {
				description: 'fake-description',
			},
		});
		expect(data.statusCode).toBe(201);
		expect(data.result).toStrictEqual(expected);
	});
});
