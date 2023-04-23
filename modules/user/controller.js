import { ModelFactory, handleError } from '../../common/index.js';
import { UserModel } from './schema.js';
import _ from 'lodash';
// const sha256 = require('crypto-js/sha256');
import config from '../../config.js';

/**
 * Define Sample module
 * @type Class
 */
class userController {
    /**
     * constructor to Set routing NameSpace and registering the routes
     * @param app
     */
    constructor(app) {

        Object.assign(this, app);

        this.model = new ModelFactory(UserModel);
        this.errorHandler = handleError;
    }

    signup = async (req, res) => {
        try {
            const userEmail = req.body.email.toLowerCase();

            // POINT: Better to include google recaptcha here
            const verificationCode = this.generateVerificationCode();
            const newUser = await this.model.createEntity({
                email: userEmail,
                verificationCode
            });
            // @TODO: you should send the verification code to user by email
            res.send({ username: newUser.mobile, verificationCodeDate: newUser.verificationCodeDate });
        } catch (error) {
            const errorMessage = _.get(error, 'errorObj.additionalInformation.message', false);
            // if we get duplicate error message from mongoose, we handle different response
            if (errorMessage && errorMessage.includes('duplicate key error')) {
                const userMobile = req.body.mobile.toLowerCase();
                const user = await this.model.findEntityByParams({ mobile: userMobile }, { verified: true });
                this.errorHandler(createErrorObject({ msg: 'user Already Registered.' }, { verified: user.verified }), res);
            } else {
                this.errorHandler(error, res);
            }
        }
    }

    /**
     * resend verification code, in case user didn't received the code
     * @param {*} req 
     * @param {*} res 
     */
    async resendVerification(req, res) {
        try {
            const userEmail = req.body.email.toLowerCase();
            const userInfo = await this.model.findEntityByParams({ email: userEmail });
            if (_.get(userInfo, 'verified') || !userInfo) {
                res.send({ status: 'failed' });
            } else {
                const vcDate = new Date(userInfo.verificationCodeDate);
                vcDate.setMinutes(vcDate.getMinutes() + config.VERIFICATION_CODE_LIFE_TIME);
                let verificationCodeDate = userInfo.verificationCodeDate;
                if (vcDate.getTime() < Date.now()) {
                    const verificationCode = this.generateVerificationCode();
                    verificationCodeDate = new Date();
                    await this.model.updateEntityByModel(userInfo, {
                        verificationCode,
                        verificationCodeDate
                    });
                    // @TODO: Send Verification Email
                }
                res.send({ status: 'success', verificationCodeDate });
            }
        } catch (error) {
            this.errorHandler(error, res);
        }
    }

    // 	/**
    // 	 * verify the email by code and generate verificationCode to set password
    // 	 * @param req
    // 	 * @param res
    // 	 */
    // 	async verify(req, res) {
    // 		try {
    // 			const code = req.body.code;
    // 			const userInfo = await this.model.findEntityByParams({
    // 				mobile: req.body.mobile,
    // 				verificationCode: code
    // 			});
    // 			if (userInfo === null) {
    // 				return res.send({ verified: false });
    // 			}
    // 			const vcDate = new Date(userInfo.verificationCodeDate);
    // 			vcDate.setMinutes(vcDate.getMinutes() + config.VERIFICATION_CODE_LIFE_TIME);
    // 			if (userInfo.verificationCode === code && vcDate.getTime() > Date.now()) {
    // 				res.send({ verified: true, mobile: userInfo.mobile, code: userInfo.verificationCode });
    // 			} else {
    // 				res.send({ verified: false });
    // 			}
    // 		} catch (error) {
    // 			this.errorHandler(error, res);
    // 		}
    // 	}

    // 	/**
    // 	 * set user profile
    // 	 * @param req
    // 	 * @param res
    // 	 */
    // 	async setProfile(req, res) {
    // 		try {
    // 			const userMobile = req.body.mobile.toLowerCase();
    // 			const verificationCode = req.body.code.toLowerCase();
    // 			const userInfo = await this.model.findEntityByParams({ mobile: userMobile });
    // 			const vcDate = new Date(userInfo.verificationCodeDate);
    // 			vcDate.setMinutes(vcDate.getMinutes() + config.VERIFICATION_CODE_LIFE_TIME);

    // 			if (userInfo.verified === false && vcDate.getTime() > Date.now() && userInfo.verificationCode === verificationCode) {
    // 				const pwd = (req.body.password) ? sha256(req.body.password).toString() : '';
    // 				await this.model.updateEntityByModel(userInfo, {
    // 					name: req.body.name,
    // 					lastName: req.body.lastName,
    // 					verified: true,
    // 					password: pwd
    // 				});
    // 				res.send({ status: true });
    // 			} else {
    // 				res.status(400).send({ message: 'Verification code is not valid!' });
    // 			}
    // 		} catch (error) {
    // 			this.errorHandler(error, res);
    // 		}
    // 	}

    // 	/**
    // 	 * express middleware authenticate user with credential
    // 	 * @param req
    // 	 * @param res
    // 	 * @param next
    // 	 */
    // 	async userAuth(req, res, next) {
    // 		try {
    // 			const userMobile = req.body.mobile.toLowerCase();
    // 			const pwd = sha256(req.body.password).toString();
    // 			let userInfo = await this.model.findEntityByParams({ mobile: userMobile, password: pwd }, { 'password': false });
    // 			if (userInfo === null) {
    // 				return res.status(400).send({
    // 					errorCode: 'AUTHFAILED',
    // 					additionalInformation: {
    // 						message: 'username or password is wrong!'
    // 					}
    // 				});
    // 			}
    // 			userInfo = userInfo.toObject();
    // 			const token = await this.auth.generateUserToken(userInfo, config.SECRET_KEY);
    // 			res.set('Authorization', token);
    // 			res._user = userInfo;
    // 			next();
    // 		} catch (error) {
    // 			this.errorHandler(error, res);
    // 		}
    // 	}

    // 	/**
    // 	 * login method to send the user detail
    // 	 * @param req
    // 	 * @param res
    // 	 */
    // 	async login(req, res) {
    // 		res.send({
    // 			name: res._user.name || '',
    // 			lastName: res._user.lastName || '',
    // 			mobile: res._user.mobile || ''
    // 		});
    // 	}

    // 	/**
    // 	 * log out
    // 	 * @param req
    // 	 * @param res
    // 	 */
    // 	async logout(req, res) {
    // 		return res.send({ message: 'success' });
    // 	}

    // 	/**
    // 	 * change user password
    // 	 * @param req
    // 	 * @param res
    // 	 */
    // 	async changeUserPassword(req, res) {
    // 		try {
    // 			const userInfo = await this.model.findEntityByParams({ _id: req._user._id });
    // 			const currentPassword = sha256(req.body.password).toString();
    // 			const newPassword = sha256(req.body.new).toString();
    // 			if (currentPassword === userInfo.password) {
    // 				await this.model.updateEntityByModel(userInfo, { password: newPassword });
    // 				res.send({ status: true });
    // 			} else {
    // 				res.status(400).send({
    // 					errorCode: 'VALIDATIONFAILED',
    // 					additionalInformation: {
    // 						message: 'current password is wrong!'
    // 					}
    // 				});
    // 			}
    // 		} catch (error) {
    // 			this.errorHandler(error, res);
    // 		}
    // 	}

    // 	/**
    // 	 * update user profile
    // 	 * @param req
    // 	 * @param res
    // 	 */
    // 	async updateProfile(req, res) {
    // 		try {
    // 			const userInfo = await this.model.findEntityByParams({ _id: req._user._id });
    // 			await this.model.updateEntityByModel(userInfo, {
    // 				name: req.body.name,
    // 				lastName: req.body.lastName
    // 			});
    // 			res.send({ message: 'your profile updated successfully' });
    // 		} catch (error) {
    // 			this.errorHandler(error, res);
    // 		}
    // 	}

    // 	/**
    // 	 * generate a new random password and share with user
    // 	 * @param req
    // 	 * @param res
    // 	 */
    // 	async forgetPassword(req, res) {
    // 		try {
    // 			const userMobile = req.body.mobile.toLowerCase();
    // 			const userInfo = await this.model.findEntityByParams({ mobile: userMobile }, { password: false });
    // 			if (userInfo === null) {
    // 				return res.status(400).send({
    // 					errorCode: 'AUTHFAILED',
    // 					additionalInformation: {
    // 						message: 'username is wrong'
    // 					}
    // 				});
    // 			}
    // 			const vcDate = new Date(userInfo.verificationCodeDate);
    // 			vcDate.setMinutes(vcDate.getMinutes() + config.VERIFICATION_CODE_LIFE_TIME);
    // 			if (Date.now() < vcDate.getTime()) {
    // 				res.send({ success: true, verificationCodeDate: userInfo.verificationCodeDate });
    // 			} else if (userInfo.verified === true) {
    // 				const verificationCode = this.generateVerificationCode();
    // 				const verificationCodeDate = new Date();
    // 				await this.model.updateEntityByModel(userInfo, {
    // 					verificationCode,
    // 					verificationCodeDate
    // 				});

    // 				// @TODO: you should send the verification code to user by sms or online
    // 				// smsService.sendVerification(userMobile, verificationCode);

    // 				res.send({ success: true, verificationCodeDate });
    // 			} else {
    // 				res.status(400).send({
    // 					errorCode: 'NOTVERIFIED',
    // 					additionalInformation: {
    // 						message: 'user not verified!'
    // 					}
    // 				});
    // 			}
    // 		} catch (error) {
    // 			this.errorHandler(error, res);
    // 		}
    // 	}

    // 	/**
    // 	 * set new password
    // 	 * @param req
    // 	 * @param res
    // 	 */
    // 	async setNewPassword(req, res) {
    // 		try {
    // 			const userMobile = req.body.mobile.toLowerCase();
    // 			const userInfo = await this.model.findEntityByParams({ mobile: userMobile });
    // 			if (userInfo === null) {
    // 				return res.status(400).send({
    // 					errorCode: 'AUTHFAILED',
    // 					additionalInformation: {
    // 						message: 'username is wrong!'
    // 					}
    // 				});
    // 			}
    // 			const secureKeyDate = new Date(userInfo.verificationCodeDate);
    // 			secureKeyDate.setMinutes(secureKeyDate.getMinutes() + config.VERIFICATION_CODE_LIFE_TIME);
    // 			if (userInfo.verificationCode === req.body.code && userInfo.verified === true && secureKeyDate.getTime() > Date.now()) {
    // 				const password = (req.body.password) ? sha256(req.body.password).toString() : '';
    // 				await this.model.updateEntityByModel(userInfo, { password });
    // 				res.send({ success: true });
    // 			} else {
    // 				res.status(400).send({
    // 					errorCode: 'INVALIDCODE',
    // 					additionalInformation: {
    // 						message: 'verification code is not valid!'
    // 					}
    // 				});
    // 			}
    // 		} catch (error) {
    // 			this.errorHandler(error, res);
    // 		}
    // 	}

    // 	/**
    // 	 * get logged in user profile detail
    // 	 * @param req
    // 	 * @param res
    // 	 */
    // 	async getProfile(req, res) {
    // 		try {
    // 			const userProfile = await this.model.findEntityByParams({ _id: req._user._id }, {
    // 				_id: 0, password: 0, verificationCode: 0, verificationCodeDate: 0, verified: 0
    // 			});
    // 			res.send({ message: 'success', data: userProfile });
    // 		} catch (error) {
    // 			this.errorHandler(error, res);
    // 		}
    // }

    /**
     * generate a 6 digit verification code
     */
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000);
    }

}

export default (app) => new userController(app);
