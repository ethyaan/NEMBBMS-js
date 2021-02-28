const redis = require('redis');
const Jwtr = require('jwt-redis');
const logger = require('./logger');
const config = require('../config');

class Authentication {
	_Jwtr = null;
	_connected = false;
	_Client = null;

	constructor() {

		this.generateUserToken = this.generateUserToken.bind(this);
		this.isUserLoggedIn = this.isUserLoggedIn.bind(this);
		this.logOutUser = this.logOutUser.bind(this);
	}

	async connect() {
		return new Promise((resolve, reject) => {
			this._Client = redis.createClient({ host: config.REDIS_HOST, port: config.REDIS_PORT });
			this._Client.auth(config.REDIS_PASS, (reply) => {
				if (reply !== null) {
					console.error('Error Redis Authentication : => ', reply.toString());
					reject();
				}
			});

			this._Client.on('connect', () => {
				logger.success('Redis Connected Successfully');
				this._Jwtr = new Jwtr(this._Client, { prefix: 'utoken_' });
				resolve(true);
			});

			this._Client.on('error', (error) => {
				logger.error('Redis Connect Error => ', error.toString());
				reject();
			});

			this._Client.on('end', () => {
				logger.info('Redis Connection closed!');
				reject();
			});
		});
	}

	/**
	 * close the redis connection
	 */
	async close() {
		this._Client.quit();
	}

	/**
	 * @param userInfo
	 */
	async generateUserToken(userInfo) {
		return this._Jwtr.sign(JSON.parse(JSON.stringify(userInfo)), config.JWT_SECRET + '_user', { expiresIn: config.JWT_LIFE_TIME });
	}

	/**
	 * @param token
	 */
	async verifyUserToken(token) {
		return this._Jwtr.verify(token, config.JWT_SECRET + '_user');
	}

	/**
	 * @param token
	 */
	async destroyToken(token) {
		return this._Jwtr.destroy(token.jti);
	}

	/**
	 * @param req
	 */
	async isUserLoggedIn(req, res, next) {
		if (!req) { return null; }
		const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
		if (token === null) {
			return res.status(401).send('unAuthorized');
		} else {
			try {
				req._user = await this.verifyUserToken(token);
				next();
			} catch (error) {
				logger.error('isUserLoggedIn Failed => ', error.toString());
				return res.status(401).send('unAuthorized');
			}
		}
	}

	/**
	 * log out user by destroying it's token
	 * @param req
	 * @param res
	 * @param next
	 */
	async logOutUser(req, res, next) {
		const { result, error } = await this._Jwtr.destroy(req._user['jti']);
		if (error) {
			logger.error('AuthenticationService=>logOutUser => Error while Destroy token', error);
		} else {
			logger.log('AuthenticationService=>logOutUser => User Logged Out', result);
		}
		next();
	}

	async isUserLoggedInMap(req, res, next) {
		const tokenKey = req.get('authorization');
		if (tokenKey === undefined) {
			next();
		} else {
			try {
				const tokenString = tokenKey.split(' ')[1];
				req._user = await this.verifyUserToken(tokenString);
				next();
			} catch (error) {
				logger.error('Authentication Failed => ', error.toString());
				return res.status(500).send({ message: 'authorization check failed' });
			}
		}
	}

}

module.exports =  new Authentication();
