import { Router } from 'express';

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

		// const controller = require('./controller')(app);
		const sampleRouter = Router();

		// sampleRouter.get('/', controller.sampleAPI);

		app.use('/sample', sampleRouter);

	}

}
export default (app) => new sampleRouter(app);
