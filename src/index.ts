/*
	Talent Platform API Service
	Copyright Encora @ 2021 
	License: Legacy
	CODEOWNERS: xOChilpili, Karla

	Instructions: 

	start server: 
		npm run build
		node dist/index.js
	to stop the server, press: Ctrl+C 

*/

import 'reflect-metadata';
import Server from './server';

(async () => {
	await Server.start();

	const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
	signalTraps.forEach((type) => {
		process.once(type, async () => {
			try {
				await Server.stop();
			} finally {
				process.kill(process.pid, type);
			}
		});
	});
})();
