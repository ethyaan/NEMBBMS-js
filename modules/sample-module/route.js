const router = require('express').Router;

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

		const controller = require('./controller')(app);
		const sampleRouter = router();

		sampleRouter.get('/', controller.sampleAPI);

		app.use('/sample', sampleRouter);

	}

}

module.exports = (app) => new sampleRouter(app);
