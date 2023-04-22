import dotenv from 'dotenv';
dotenv.config();

const env = process.env;
export default {
	LOG_TYPES: ['error', 'info', 'warn', 'log', 'success', 'validation'],
	PORT: env.PORT,
	MONGO_URI: env.MONGO_URI,
	DBNAME: env.DBNAME,
	VERIFICATION_CODE_LIFE_TIME: env.VERIFICATION_CODE_LIFE_TIME,
	RESEND_VC_LIFE_TIME: env.RESEND_VC_LIFE_TIME,
	// AUTH_TABLE_NAME: env.AUTH_TABLE_NAME,
	JWT_SECRET: env.JWT_SECRET,
};
