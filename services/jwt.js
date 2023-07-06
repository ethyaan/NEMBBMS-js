import config from '../config.js';
import JsonWebToken from 'jsonwebtoken';

// JWT provider options

// tslint:disable-next-line: max-classes-per-file
export class TokenInvalidError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Token Destry Error
 */
export class TokenDestroyedError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * JWT provider class, uses jsonwebtoken and DynamoDB to store the tokens
 */
export class JWT {

    constructor() {
        // :)
    }

    /**
     * sign a token
     * @param payload
     * @param options
     * @returns
     */
    sign = async (payload, options) => {
        const jti = payload.jti || generateId(10);
        const token = JsonWebToken.sign({ ...payload, jti }, config.JWT_SECRET, Object.assign({ expiresIn: '1d' }, options));
        return token;
    }

    /**
     * decode a token
     * @param token
     * @param options
     * @returns
     */
    decode(token, options) {
        return JsonWebToken.decode(token, options);
    }

    /**
     * verify a token
     * @param token
     * @param options
     * @returns
     */
    async verify(token, options) {
        const decoded_1 = await new Promise((resolve, reject) => {
            return JsonWebToken.verify(token, config.JWT_SECRET, options, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                return resolve(decoded);
            });
        });
        if (!decoded_1.jti) {
            throw new TokenInvalidError();
        }
        return decoded_1;
    }

    /**
     * is user Logged In
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    isLoggedIn = async (req, res, next) => {
        let tokenKey = req.get('Authorization');
        if (tokenKey === undefined) {
            return res.status(401).send('unAuthorized');
        } else {
            try {
                let tokenString = tokenKey.split(' ')[1];
                req._user = await this.verify(tokenString);
                next();
            } catch (error) {
                logger.error('Authentication Failed => ', error.toString());
                return res.status(401).send('unAuthorized');
            }
        }
    }
}

export const Auth = new JWT();

/**
 * generate jwt id
 * @param length
 * @returns
 */
function generateId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
