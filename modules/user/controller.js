const createModel = require('../../utils/model.factory');
const { UserModel } = require('./schema');
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
		} catch(error) {
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

}

module.exports = (app) => new userController(app);
