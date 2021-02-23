const APP_URL = process.env.APP_URL;
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI || ``;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || ``;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = parseInt(process.env.REDIS_PORT || ``);
const REDIS_PASS = process.env.REDIS_PASS;
const VERIFICATION_CODE_LIFE_TIME = parseInt(process.env.VERIFICATION_CODE_LIFE_TIME || `5`);
const RESEND_VC_LIFE_TIME = process.env.RESEND_VC_LIFE_TIME;
const WORKERS = process.env.WORKERS;
const STATIC_HOST = process.env.STATIC_HOST;
const JWT_LIFE_TIME = process.env.JWT_LIFE_TIME;
const JWT_SECRET = process.env.JWT_SECRET;
const RE_CAPTCHA_KEY = process.env.RE_CAPTCHA_KEY;
const BACKEND_ADDR = 'https://yourdomain.com';
const LOG_TYPES = ['error', 'info', 'warn', 'log', 'success', 'validation'];
const SECRET_KEY = 'j8N@bAcBq2=RnQt';

module.exports = {
	APP_URL,
	PORT,
	MONGODB_URI,
	MONGODB_PASSWORD,
	REDIS_HOST,
	REDIS_PORT,
	REDIS_PASS,
	VERIFICATION_CODE_LIFE_TIME,
	RESEND_VC_LIFE_TIME,
	WORKERS,
	STATIC_HOST,
	JWT_LIFE_TIME,
	JWT_SECRET,
	RE_CAPTCHA_KEY,
	BACKEND_ADDR,
	LOG_TYPES,
	SECRET_KEY
};
