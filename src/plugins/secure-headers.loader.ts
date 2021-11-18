import { Boom } from '@hapi/boom';
import { Server, Request, ResponseToolkit } from '@hapi/hapi';
import { appContext } from '../inversify.config';
import { Types } from '../types';
import { ILogger } from '../logger';

export class SecureHeaderLoader {
	private logger = appContext.get<ILogger>(Types.Logger);

	register = async (server: Server): Promise<void> => {
		try {
			await server.ext({
				type: 'onPreResponse',
				method: async (_req: Request, h: ResponseToolkit) => {
					const response = _req.response;
					if (response instanceof Boom && response.isBoom) return h.continue;
					const headerConf: { append: boolean } = { append: true };
					const aResponse = h.response(response);
					// Most references from : https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/
					aResponse.header('Permission-Policy', '', headerConf);
					aResponse.header('Referrer-Policy', 'same-origin', headerConf);
					aResponse.header('Strict-Transport-Security', '15768000', headerConf); // Ref: https://hapi.dev/api?v=20.2.0#-routeoptionssecurity
					aResponse.header('X-Frame-Options', 'DENY', headerConf);
					aResponse.header('X-XSS-Protection', '0', headerConf); // ref : https://github.com/helmetjs/helmet/tree/a7261d0276bc1e710398c378d148e7c71bb2adf9/middlewares/x-xss-protection
					aResponse.header('Cross-Origin-Embedder-Policy', 'require-corp', headerConf);
					aResponse.header('Cross-Origin-Opener-Policy', 'same-origin', headerConf);
					aResponse.header('Cross-Origin-Resource-Policy', 'same-origin', headerConf);
					aResponse.header('Expect-CT', 'maxAge=86400', headerConf); // maxAge, just a dummy value, not computed: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect-CT
					aResponse.header('Origin-Agent-Cluster', '?1', headerConf);
					aResponse.header('X-Content-Type-Options', 'nosniff', headerConf);
					aResponse.header('X-Download-Options', 'noopen', headerConf);
					aResponse.header('X-Permitted-Cross-Domain-Policies', 'none', headerConf);
					return h.continue;
				},
			});
			this.logger.info('CST Headers Registered');
		} catch (error) {
			this.logger.error({ error }, 'Error Loading Logger Plugin');
			throw error;
		}
	};
}
