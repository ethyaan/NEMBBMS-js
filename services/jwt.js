import config from '../config.js';
import * as jsonwebtoken from 'jsonwebtoken';

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
     * @param secretOrPrivateKey
     * @param options
     * @returns
     */
    sign = async (payload, secretOrPrivateKey, options) => {
        const jti = payload.jti || generateId(10);
        const token = jsonwebtoken.sign({ ...payload, jti }, secretOrPrivateKey, Object.assign({ expiresIn: '1d' }, options));
        return token;
    }

    /**
     * decode a token
     * @param token
     * @param options
     * @returns
     */
    decode(token, options) {
        return jsonwebtoken.decode(token, options);
    }

    /**
     * verify a token
     * @param token
     * @param secretOrPublicKey
     * @param options
     * @returns
     */
    async verify(token, secretOrPublicKey, options){
        const decoded_1 = await new Promise((resolve, reject) => {
            return jsonwebtoken.verify(token, secretOrPublicKey, options, (err, decoded) => {
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
}

export const Auth = new JWTDynamoDB();

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
