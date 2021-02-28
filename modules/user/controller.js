const createModel = require('../../utils/model.factory');
const { UserModel } = require('./schema');
const { handleError } = require('../../services/error');
const _ = require('lodash');

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

		this.model = new createModel(UserModel);
		this.errorHandler = handleError;
	}

	async signup(req, res) {
		try {
			const userMobile = req.body.mobile.toLowerCase();
			// @TODO: we can and we better have google recaptcha check here
			const verificationCode = this.generateVerificationCode();
			const newUser = await this.model.createEntity({
				mobile: userMobile,
				verificationCode
			});
			// @TODO: you should send the verification code to user by sms or online
			// smsService.sendVerification(userMobile, verificationCode);

			res.send({ username: newUser.mobile, verificationCodeDate: newUser.verificationCodeDate });
		} catch (error) {
			const errorMessage = _.get(error, 'errorObj.additionalInformation.message', false);
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
			const userMobile = req.body.mobile.toLowerCase();
			const userInfo = await this.model.findEntityByParams({ mobile: userMobile });
			if (userInfo.verified) {
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
					this.sms.sendVerification(userMobile, verificationCode);
				}
				res.send({ status: 'success', verificationCodeDate });
			}
		} catch (error) {
			this.errorHandler(error, res);
		}
	}

	/**
	 * verify the email by code and generate verificationCode to set password
	 * @param req
	 * @param res
	 */
	async verify(req, res) {
		try {
			const code = req.body.code;
			const userInfo = await this.model.findEntityByParams({
				mobile: req.body.mobile,
				verificationCode: code
			});
			if (userInfo === null) {
				return res.send({ verified: false });
			}
			const vcDate = new Date(userInfo.verificationCodeDate);
			vcDate.setMinutes(vcDate.getMinutes() + config.VERIFICATION_CODE_LIFE_TIME);
			if (userInfo.verificationCode === code && vcDate.getTime() > Date.now()) {
				res.send({ verified: true, mobile: userInfo.mobile, code: userInfo.verificationCode });
			} else {
				res.send({ verified: false });
			}
		} catch (error) {
			this.errorHandler(error, res);
		}
	}

	/**
	 * set user profile
	 * @param req
	 * @param res
	 */
	async setProfile(req, res) {
		try {
			const userMobile = req.body.mobile.toLowerCase();
			const verificationCode = req.body.code.toLowerCase();
			const userInfo = await this.model.findEntityByParams({ mobile: userMobile });
			const vcDate = new Date(userInfo.verificationCodeDate);
			vcDate.setMinutes(vcDate.getMinutes() + config.VERIFICATION_CODE_LIFE_TIME);

			if (userInfo.verified === false && vcDate.getTime() > Date.now() && userInfo.verificationCode === verificationCode) {
				const pwd = (req.body.password) ? sha256(req.body.password).toString() : '';
				await this.model.updateEntityByModel(userInfo, {
					name: req.body.name,
					lastName: req.body.lastName,
					verified: true,
					password: pwd
				});
				res.send({ status: true });
			} else {
				res.status(400).send({ message: 'Verification code is not valid!' });
			}
		} catch (error) {
			this.errorHandler(error, res);
		}
	}

	/**
	 * generate verification code
	 */
	generateVerificationCode() {
		return Math.floor(100000 + Math.random() * 900000);
	}

}

module.exports = (app) => new userController(app);
