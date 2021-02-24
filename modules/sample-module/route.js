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

        // const controller = require('./controller')(app);
        const userRouter = router();


        app.use('/sample', userRouter);

    }

}

module.exports = (app) => new sampleRouter(app);
