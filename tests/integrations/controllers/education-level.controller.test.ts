import 'reflect-metadata';
import Hapi from '@hapi/hapi';
import { Repository } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError'
import sinon from 'sinon';

import { get as getConfig } from '../../../src/config';
import Server from '../../../src/server';


describe('Availability Controller Test', () => {
	let server: Hapi.Server;
	const apiVersion = getConfig('/service/apiVersion');
    let sandbox: sinon.SinonSandbox;

	const successPromise = (result: any): Promise<any> => {
		return new Promise((resolve) =>{
			resolve(result);
		})
	};

	beforeAll(async () => {
		server = await Server.start();
        sandbox = sinon.createSandbox();
	});

	afterAll(async () => {
		await Server.stop();
	});

    afterEach(() => {
		sandbox.restore()
	});

	it('should get education level', async () => {
		const mockData = [{
			id_education_level: 1,
			description: "Bachelors"
		}];

        const stub = sandbox.stub(Repository.prototype)
        stub.find.returns(successPromise(mockData));

		const data = await server.inject({
			method: 'GET',
			url: `/${apiVersion}/education-level`,
		});

		expect(data.statusCode).toBe(200);
		expect(data.result).toMatchObject(mockData);
	});

    it('should create education level', async () => {
		const mockData = {
			description: "Bachelors"
		};

        const stub = sandbox.stub(Repository.prototype)
        stub.save.returns(successPromise(mockData));

		const data = await server.inject({
			method: 'POST',
			url: `/${apiVersion}/education-level`,
            payload: mockData
		});
		expect(data.statusCode).toBe(200);
		expect(data.result).toMatchObject(mockData);
	});

    it('should return error when creating education level without body', async () => {
		const mockData = {
			description: "Bachelors"
		};

        const stub = sandbox.stub(Repository.prototype)
        stub.save.returns(successPromise(mockData));

		const data = await server.inject({
			method: 'POST',
			url: `/${apiVersion}/education-level`,
		});
		expect(data.statusCode).toBe(400);
	});


    it('should return error when creating education level with incorrect body schema', async () => {
		const mockData = {
			description: "Bachelors"
		};

        const stub = sandbox.stub(Repository.prototype)
        stub.save.returns(successPromise(mockData));

		const data = await server.inject({
			method: 'POST',
			url: `/${apiVersion}/education-level`,
            payload: {
                unkwonAttribute: true,
            }
		});
		expect(data.statusCode).toBe(400);
	});

    it('should update education level', async () => {
		const mockData = {
			description: "Bachelors"
		};

        const stub = sandbox.stub(Repository.prototype)
		stub.findOneOrFail.returns(successPromise(mockData));
        stub.save.returns(successPromise(mockData));

		const data = await server.inject({
			method: 'PUT',
			url: `/${apiVersion}/education-level/1`,
            payload: mockData
		});
		expect(data.statusCode).toBe(200);
	});

	it('should fail update if resource not found', async () => {
		const mockData = {
			description: "Bachelors"
		};

        const stub = sandbox.stub(Repository.prototype)
		stub.findOneOrFail.throws(EntityNotFoundError);

		const data = await server.inject({
			method: 'PUT',
			url: `/${apiVersion}/education-level/1`,
			payload: mockData
		});
		expect(data.statusCode).toBe(500);
	});

	it('should delete education level', async () => {
		const mockData = {
			description: "Bachelors"
		};

        const stub = sandbox.stub(Repository.prototype)
		stub.findOneOrFail.returns(successPromise(mockData));
        stub.save.returns(successPromise(mockData));

		const data = await server.inject({
			method: 'DELETE',
			url: `/${apiVersion}/education-level/1`,
            payload: mockData
		});
		expect(data.statusCode).toBe(200);
	});

	it('should fail delete if resource not found', async () => {
		const mockData = {
			description: "Bachelors"
		};

        const stub = sandbox.stub(Repository.prototype)
		stub.findOneOrFail.throws(EntityNotFoundError);

		const data = await server.inject({
			method: 'DELETE',
			url: `/${apiVersion}/education-level/1`,
			payload: mockData
		});
		expect(data.statusCode).toBe(500);
	});
});
