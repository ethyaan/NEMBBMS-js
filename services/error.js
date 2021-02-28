const logger = require('./logger');

const createErrorObject = (options, additionalInfo) => {
	const additionalInformation = { message: options.msg };
	Object.assign(additionalInformation, additionalInfo || {});
	return {
		responseCode: options.statusCode || 422,
		errorObj: {
			errorCode: options.errorCode || 'GeneralError',
			additionalInformation
		}
	};
};

const createError = (options, additionalInfo) => {
	return Promise.reject(createErrorObject(options, additionalInfo));
};

const handleError = (error, res) => {
	const errorOutput = error.errorObj || createErrorObject({ msg: 'Error while performing your request' }).errorObj;
	logger.error('Catch Handler => ', error);
	res.status(error.responseCode || 500).send(errorOutput);
};

module.exports = { createErrorObject, createError, handleError };
