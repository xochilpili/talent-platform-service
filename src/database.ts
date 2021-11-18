import { inject, injectable } from 'inversify';
import { Connection, createConnection, ObjectType } from 'typeorm';
import { Types } from './types';
import { IDatabase } from './interfaces/database';
import { ILogger } from './logger';
import { get as getConfig } from './config';
// entities
import { CatAvailability } from './domain/entities/availabilities.entity';

@injectable()
export class DatabaseService implements IDatabase {
	private static connection: Connection;

	// eslint-disable-next-line no-useless-constructor
	public constructor(@inject(Types.Logger) readonly logger: ILogger) {}

	public async getConnection(): Promise<Connection> {
		if (DatabaseService.connection instanceof Connection) {
			return DatabaseService.connection;
		}

		try {
			DatabaseService.connection = await createConnection({
				type: 'postgres',
				host: getConfig('/database/host'),
				port: getConfig('/database/port'),
				username: getConfig('/database/username'),
				password: getConfig('/database/password'),
				database: getConfig('/database/dbname'),
				entities: [CatAvailability],
				synchronize: true,
			});
			this.logger.info(`Connection with PostgreSQL stablished`);
			return DatabaseService.connection;
		} catch (error: Error | unknown) {
			this.logger.error({ error }, `Unable to connect with PostgreSQL`);
			process.exit(1);
		}
	}

	public async getRepository<T>(repository: ObjectType<T>): Promise<T> {
		const connection: Connection = await this.getConnection();
		return await connection.getCustomRepository<T>(repository);
	}

	public async closeConnection(): Promise<void> {
		await DatabaseService.connection.close();
	}
}
