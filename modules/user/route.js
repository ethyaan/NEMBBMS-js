const router = require('express').Router;

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

		userRouter.post('/', controller.signup);
		userRouter.post('/resendVerification', controller.resendVerification);
		userRouter.post('/verify', controller.verify);
		userRouter.post('/setProfile', controller.setProfile);
		userRouter.post('/login', controller.userAuth, controller.login);
		userRouter.post('/logout', [app._Auth.isUserLoggedIn, app._Auth.logOutUser], controller.logout);
		userRouter.post('/changePassword', [ app._Auth.isUserLoggedIn ], controller.changeUserPassword);
		userRouter.post('/updateProfile', [ app._Auth.isUserLoggedIn], controller.updateProfile);
		userRouter.post('/forgetPassword', controller.forgotPassword);
		userRouter.post('/setNewPassword', controller.setNewPassword);
		userRouter.get('/getProfile', [app._Auth.isUserLoggedIn], controller.getProfile);

		app.use('/user', userRouter);

	}

}

module.exports = (app) => new usersRouter(app);
