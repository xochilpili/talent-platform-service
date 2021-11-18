import { Container } from 'inversify';
import { ILogger, Logger } from './logger';
import { IRouter } from './interfaces/router';
import { IDatabase } from './interfaces/database';
import { Types } from './types';
import { Router } from './router';
import { DatabaseService } from './database';
import { get as getConfig } from './config';

const appContext = new Container({
	defaultScope: 'Singleton',
	autoBindInjectable: true,
});

const loggerOptions = {
	level: getConfig('/logger/level'),
};

appContext.bind<ILogger>(Types.Logger).toConstantValue(Logger(loggerOptions));
appContext.bind<IRouter>(Types.Router).to(Router);
appContext.bind<IDatabase>(Types.DatabaseService).to(DatabaseService);

export { appContext };
