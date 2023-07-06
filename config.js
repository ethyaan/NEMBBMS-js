import dotenv from 'dotenv';
dotenv.config();

const env = process.env;

const logTypes = process.env.NODE_ENV !== 'test' ? ['error', 'info', 'warn', 'log', 'success', 'validation'] : [];
export default {
	LOG_TYPES: logTypes,
	APP_URL: env.APP_URL,
	APP_FRONT: env.APP_FRONT,
	PORT: env.PORT,
	MONGO_URI: env.MONGO_URI,
	DBNAME: env.DBNAME,
	VERIFICATION_CODE_LIFE_TIME: env.VERIFICATION_CODE_LIFE_TIME,
	// AUTH_TABLE_NAME: env.AUTH_TABLE_NAME,
	JWT_SECRET: env.JWT_SECRET,
	SENDGRID_API_KEY: env.SENDGRID_API_KEY,
	RECAPTCHA_KEY: env.RECAPTCHA_KEY
};
