import Boom, { Boom as BoomError } from '@hapi/boom';
import { HttpStatusCodes, IError } from '../interfaces/responses';

export enum ErrorType {
	UNEXPECTED_ERROR = 'UnexpectedError',
}

export interface CustomError {
	message: string;
	route: string;
	method: string;
	issue: string;
	learnMore: string;
}

export class Errors {
	static build(error: BoomError, result: IError): BoomError {
		const errorPayload = {
			type: 'error',
			message: error.message,
			result: result,
			statusCode: error.output.statusCode,
		};
		Object.assign(error.output.payload, errorPayload);
		return error;
	}

	static notFound(customError: CustomError): BoomError {
		return Errors.build(Boom.notFound(customError.message), {
			type: 'NotFound',
			description: {
				route: customError.route,
				method: customError.method,
				issue: customError.issue,
			},
			learnMore: customError.learnMore,
			statusCode: HttpStatusCodes.NOT_FOUND,
		});
	}

	static unexpected(error: Error, route: string, learnMore = ''): BoomError {
		const boomError = error as BoomError;
		if (boomError.isBoom && boomError.output.payload) {
			return boomError;
		}
		return Errors.build(Boom.boomify(error), {
			type: ErrorType.UNEXPECTED_ERROR,
			description: {
				route,
				method: error.stack as string,
				issue: error.stack as string,
			},
			learnMore: learnMore,
			statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
		});
	}

	static conflict(customError: CustomError): BoomError {
		return Errors.build(Boom.conflict(customError.message), {
			type: 'Conflict',
			description: {
				route: customError.route,
				method: customError.method,
				issue: customError.issue,
			},
			learnMore: customError.learnMore,
			statusCode: HttpStatusCodes.CONFLICT,
		});
	}

	static badRequest(customError: CustomError): BoomError {
		return Errors.build(Boom.badRequest(customError.message), {
			type: 'BadRequest',
			description: {
				route: customError.route,
				method: customError.method,
				issue: customError.issue,
			},
			learnMore: customError.learnMore,
			statusCode: HttpStatusCodes.BAD_REQUEST,
		});
	}

	static unauthorized(customError: CustomError): BoomError {
		return Errors.build(Boom.unauthorized(customError.message), {
			type: 'Unauthorized',
			description: {
				route: customError.route,
				method: customError.method,
				issue: customError.issue,
			},
			learnMore: customError.learnMore,
			statusCode: HttpStatusCodes.UNAUTHORIZED,
		});
	}
}
