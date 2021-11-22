import 'reflect-metadata';
import Hapi from '@hapi/hapi';
import Server from '../../../src/server';
import { get as getConfig } from '../../../src/config';
import typeorm, { createConnection } from 'typeorm';
import { appContext } from '../../../src/inversify.config';
import { DatabaseService } from './../../../src/database';
import { IDatabase } from './../../../src/interfaces/database';
import { Types } from '../../../src/types';

describe('Categories Skills Controller Test', () => {
    let server: Hapi.Server;
	const apiVersion = getConfig('/service/apiVersion');
	const mockedTypeorm = typeorm as jest.Mocked<typeof typeorm>;
	const databaseService = appContext.get<IDatabase>(Types.DatabaseService);

    jest.mock('typeorm', () => ({
		createConnection: jest.fn(),
		getCustomRepository: jest.fn(),
		Connection: jest.fn().mockImplementation(() => ({
			close: jest.fn(),
		})),
	}));

    beforeAll(async () => {
		server = await Server.start();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	afterAll(async () => {
		await Server.stop();
	});

	it('should get categories skills', async() => {
		const data = await server.inject({
			method: 'GET',
			url: `/${apiVersion}/categories-skills`,
		});
		expect(data.statusCode).toBe(200);
	});
});