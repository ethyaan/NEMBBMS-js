import { Router } from 'express';
import validator from './validator.js';
import controller from './controller.js';
import { Auth } from '../../services/index.js'

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

		const userCtrl = controller(app);
		const userRouter = Router();

		userRouter.post('/', [...validator.signup()], userCtrl.signup);
		userRouter.post('/resendVerification', [...validator.resendVerification()], userCtrl.resendVerification);
		userRouter.post('/verify', [...validator.verify()], userCtrl.verify);
		userRouter.post('/login', [...validator.login()], userCtrl.userAuth, userCtrl.login);
		userRouter.post('/changePassword', [Auth.isLoggedIn, ...validator.changePassword()], userCtrl.changeUserPassword);
		userRouter.post('/updateProfile', [Auth.isLoggedIn, ...validator.updateProfile()], userCtrl.updateProfile);
		userRouter.post('/forgetPassword', [...validator.forgetPassword()], userCtrl.forgetPassword);
		// userRouter.post('/setNewPassword', [...validator.setNewPassword()], userCtrl.setNewPassword);
		userRouter.get('/getProfile', [Auth.isLoggedIn], userCtrl.getProfile);

		app.use('/user', userRouter);

	}
}

// we export an instance because we want this to be singletone
export default (app) => new usersRouter(app);
