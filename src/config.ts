import { Store } from 'confidence';
import * as dotEnv from 'dotenv';
dotEnv.config({
	path: `${process.cwd()}/.env`,
});
const document = {
	env: { $env: 'ENV', $default: 'development' },
	service: {
		apiVersion: { $env: 'API_VERSION', $default: 'v1' },
		host: { $env: 'HOST', $default: 'localhost' },
		port: { $env: 'PORT', $coerce: 'number', $default: 4000 },
	},
	database: {
		host: { $env: 'DB_HOSTNAME', $default: '192.168.105.1' },
		port: { $env: 'DB_PORT', $coerce: 'number', $default: 5432 },
		dbname: { $env: 'DB_NAME', $default: 'encore' },
		username: { $env: 'DB_USERNAME' },
		password: { $env: 'DB_PASSWORD' },
	},
	sentry: {
		dsn: { $env: 'SENTRY_DSN' },
		traceRate: { $env: 'SENTRY_TRACERATE' },
	},
	logger: {
		level: { $env: 'LOG_LEVEL', $default: 'info' },
		events: { $env: 'LOG_EVENTS', $default: 'onRequest,response,request,log,onPostStart,onPostStop' },
	},
};

const configStore = new Store(document);
export const get = (key: string) => configStore.get(key);
