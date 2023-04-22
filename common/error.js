import { Logger } from './logger.js';

/**
 * create common error object
 * @param {*} param0 
 * @returns 
 */
const createErrorObject = ({ options, additionalInfo }) => {
	return {
		responseCode: options.statusCode || 418,
		errorCode: options.errorCode || 'GeneralError',
		errorMessage: options.msg,
		additionalInfo
	};
};

/**
 * create rejected promise error to trigger catch block
 * @param input
 * @returns
 */
const createError = (input) => {
	return Promise.reject(createErrorObject(input));
};

const handleError = (error, res) => {
	const errorOutput = (error.errorMessage) ? error : createErrorObject({ options: { msg: 'Error while processing your request' } });
	Logger.error('Error Handler => ', error);
	res.status(error.responseCode || 500).send(errorOutput);
};

export { createErrorObject, createError, handleError };
