const router = require('express').Router;
const validator = require('./validator');

/**
 * Define users end API Routes
 * @type Class
 */
class usersRouter {
	/**
	 * constructor to Set routing NameSpace and registering the routes
	 * @param app
	 */
	constructor(app) {

		const controller = require('./controller')(app);
		const userRouter = router();

		userRouter.post('/', validator.signup(), validator.validate, controller.signup);
		userRouter.post('/resendVerification', validator.resendVerification(), validator.validate, controller.resendVerification);
		userRouter.post('/verify', validator.verify(), validator.validate, controller.verify);
		userRouter.post('/setProfile', validator.setProfile(), validator.validate, controller.setProfile);
		userRouter.post('/login', validator.login(), validator.validate, controller.userAuth, controller.login);
		userRouter.post('/logout', [app._Auth.isUserLoggedIn, app._Auth.logOutUser], controller.logout);
		userRouter.post('/changePassword', app._Auth.isUserLoggedIn, validator.changePassword(), validator.validate, controller.changeUserPassword);
		userRouter.post('/updateProfile', app._Auth.isUserLoggedIn, validator.updateProfile(), validator.validate, controller.updateProfile);
		userRouter.post('/forgetPassword', validator.forgetPassword(), validator.validate, controller.forgetPassword);
		userRouter.post('/setNewPassword', validator.setNewPassword(), validator.validate, controller.setNewPassword);
		userRouter.get('/getProfile', [app._Auth.isUserLoggedIn], controller.getProfile);

		app.use('/user', userRouter);

	}

}

module.exports = (app) => new usersRouter(app);
