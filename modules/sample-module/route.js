import { Router } from 'express';
import controller from './controller.js';

/**
 * Define Sample module
 * @type Class
 */
class sampleRouter {
	/**
	 * constructor to Set routing NameSpace and registering the routes
	 * @param app
	 */
	constructor(app) {

		const ctrl = controller(app);
		const sampleRouter = Router();

		sampleRouter.get('/', ctrl.sampleAPI);
		app.use('/sample', sampleRouter);
	}
}
export default (app) => new sampleRouter(app);
