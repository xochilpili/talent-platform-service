import { Connection, ObjectType } from 'typeorm';
export type IDatabase = {
	getConnection(): Promise<Connection>;
	getRepository<T>(repository: ObjectType<T>): Promise<T>;
};
