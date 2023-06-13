import { createHash } from 'node:crypto'
import { ModelFactory, handleError } from '../../common/index.js';
import { UserModel } from './schema.js';
import _ from 'lodash';
import { Auth } from '../../services/index.js';
import config from '../../config.js';
import sendGrid from '../../services/sendGrid.js';

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

    signup = async ({ body: { email, name, lastName, password } }, res) => {

        const userEmail = email.toLowerCase();
        const userName = name.toLowerCase();
        const userLastname = lastName.toLowerCase();
        const sendgrid = sendGrid();

        try {

            // @todo: #8 Better to include google recaptcha here
            const verificationCode = this.generateVerificationCode();
            const newUser = await this.model.createEntity({
                email: userEmail,
                name: userName,
                lastName: userLastname,
                verificationCode,
                password
            });
            // @TODO: #3 you should send the verification code to user by email
            const templateTags = [
                {name: "__USERNAME", value: newUser.email},
                {name: "__VERIFICATION_CODE", value: verificationCode},
            ]
            sendgrid.sendMailByTemplate(
                'Verification Code',
                'verification-code',
                templateTags,
                [newUser.email],
                'no-reply@site.com'
            );
            res.send({ username: newUser.email, verificationCodeDate: newUser.verificationCodeDate });
        } catch (error) {
            const errorMessage = _.get(error, 'errorObj.additionalInformation.message', false);
            // if we get duplicate error message from mongoose, we handle different response
            if (errorMessage && errorMessage.includes('duplicate key error')) {
                const user = await this.model.findEntityByParams({ email: userEmail }, { verified: true });
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
    resendVerification = async(req, res) => {
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
                    // @TODO: #4 Send Verification Email
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
    verify = async (req, res) => {
        try {
            const code = req.body.code;
            const userInfo = await this.model.findEntityByParams({
                email: req.body.email.toLowerCase(),
                verificationCode: code
            });
            if (userInfo === null) {
                return res.send({ verified: false });
            }
            const vcDate = new Date(userInfo.verificationCodeDate);
            vcDate.setMinutes(vcDate.getMinutes() + config.VERIFICATION_CODE_LIFE_TIME);
            if (userInfo.verificationCode === code && vcDate.getTime() > Date.now()) {
                res.send({ verified: true, email: userInfo.email, code: userInfo.verificationCode });
            } else {
                res.send({ verified: false });
            }
        } catch (error) {
            this.errorHandler(error, res);
        }
    }

    /**
     * express middleware authenticate user with credential
     * @param req
     * @param res
     * @param next
     */
    userAuth = async ({ body: { email, password } }, res, next) => {
        try {
            const userEmail = email.toLowerCase();
            const pwd = this.sha256(password);
            let userInfo = await this.model.findEntityByParams({ email: userEmail, password: pwd }, { 'password': false });
            if (userInfo === null) {
                return res.status(400).send({
                    errorCode: 'AUTHFAILED',
                    additionalInformation: {
                        message: 'username or password is wrong!'
                    }
                });
            }
            userInfo = userInfo.toObject();
            const token = await Auth.sign(userInfo);
            res.set('Authorization', token);
            res._user = userInfo;
            next();
        } catch (error) {
            this.errorHandler(error, res);
        }
    }

    /**
     * login method to send the user detail
     * @param req
     * @param res
     */
    login = async ({ _user: { name = ``, lastName = ``, email = `` } }, res) => {
        res.send({ name, lastName, email });
    }


    /**
     * change user password
     * @param req
     * @param res
     */
    changeUserPassword = async ({ _user, body: { password, new: newPWD } }, res) => {
        try {
            const userInfo = await this.model.findEntityByParams({ _id: _user._id });
            const currentPassword = this.sha256(password);
            const newPassword = this.sha256(newPWD);
            if (currentPassword === userInfo.password) {
                await this.model.updateEntityByModel(userInfo, { password: newPassword });
                res.send({ status: true });
            } else {
                res.status(400).send({
                    errorCode: 'VALIDATIONFAILED',
                    additionalInformation: {
                        message: 'current password is wrong!'
                    }
                });
            }
        } catch (error) {
            this.errorHandler(error, res);
        }
    }

    /**
     * update user profile
     * @param req
     * @param res
     */
    updateProfile = async ({ _user, body: { name, lastName } }, res) => {
        try {
            const userInfo = await this.model.findEntityByParams({ _id: _user._id });
            await this.model.updateEntityByModel(userInfo, { name, lastName });
            res.send({ message: 'your profile updated successfully' });
        } catch (error) {
            this.errorHandler(error, res);
        }
    }

    /**
     * generate a new random password and share with user
     * @param req
     * @param res
     */
    forgetPassword = async ({ body: { email } }, res) => {
        try {
            const userEmail = email.toLowerCase();
            const userInfo = await this.model.findEntityByParams({ email: userEmail }, { password: false });
            if (userInfo === null) {
                return res.status(400).send({
                    errorCode: 'AUTHFAILED',
                    additionalInformation: {
                        message: 'username is wrong'
                    }
                });
            }
            const vcDate = new Date(userInfo.verificationCodeDate);
            vcDate.setMinutes(vcDate.getMinutes() + config.VERIFICATION_CODE_LIFE_TIME);
            if (Date.now() < vcDate.getTime()) {
                res.send({ success: true, verificationCodeDate: userInfo.verificationCodeDate });
            } else if (userInfo.verified === true) {
                const verificationCode = this.generateVerificationCode();
                const verificationCodeDate = new Date();
                await this.model.updateEntityByModel(userInfo, {
                    verificationCode,
                    verificationCodeDate
                });

                // @TODO: #9 we should send verification email here

                res.send({ success: true, verificationCodeDate });
            } else {
                res.status(400).send({
                    errorCode: 'NOTVERIFIED',
                    additionalInformation: {
                        message: 'user not verified!'
                    }
                });
            }
        } catch (error) {
            this.errorHandler(error, res);
        }
    }

    /**
     * set new password
     * @param req
     * @param res
     */
    setNewPassword = async ({ body: { email, code, password } }, res) => {
        try {
            const userEmail = email.toLowerCase();
            const userInfo = await this.model.findEntityByParams({ email: userEmail });
            if (userInfo === null) {
                return res.status(400).send({
                    errorCode: 'AUTHFAILED',
                    additionalInformation: {
                        message: 'username is wrong!'
                    }
                });
            }
            const secureKeyDate = new Date(userInfo.verificationCodeDate);
            secureKeyDate.setMinutes(secureKeyDate.getMinutes() + config.VERIFICATION_CODE_LIFE_TIME);
            if (userInfo.verificationCode === code && userInfo.verified === true && secureKeyDate.getTime() > Date.now()) {
                password = (password) ? this.sha256(password).toString() : '';
                await this.model.updateEntityByModel(userInfo, { password });
                res.send({ success: true });
            } else {
                res.status(400).send({
                    errorCode: 'INVALIDCODE',
                    additionalInformation: {
                        message: 'verification code is not valid!'
                    }
                });
            }
        } catch (error) {
            this.errorHandler(error, res);
        }
    }

    /**
     * get logged in user profile detail
     * @param req
     * @param res
     */
    getProfile = async ({ _user: { _id } }, res) => {
        try {
            const userProfile = await this.model.findEntityByParams({ _id }, {
                _id: 0, password: 0, verificationCode: 0, verificationCodeDate: 0, verified: 0
            });
            res.send({ message: 'success', data: userProfile });
        } catch (error) {
            this.errorHandler(error, res);
        }
    }

    /**
     * generate a 6 digit verification code
     */
    generateVerificationCode = () => {
        return Math.floor(100000 + Math.random() * 900000);
    }

    /**
     * create sha256 hex string
     * @param {*} content 
     * @returns 
     */
    sha256 = (content) => {
        return createHash('sha256').update(content).digest('hex');
    }

}

export default (app) => new userController(app);
