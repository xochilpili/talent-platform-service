export interface IResponse<T> {
	type: 'success' | 'error';
	status: number;
	message: string;
	result: T;
}
export interface IErrorDescription {
	route: string;
	method: string;
	issue: string;
}
export interface IError {
	type: string;
	description: IErrorDescription;
	learnMore: string;
	statusCode?: number;
}
enum HttpStatusCodes {
	OK = 200,
	CREATED = 201,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	CONFLICT = 409,
	INTERNAL_SERVER_ERROR = 500,
}
export { HttpStatusCodes };
