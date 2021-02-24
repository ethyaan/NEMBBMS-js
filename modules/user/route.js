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

        // const controller = require('./controller')(app);
        const userRouter = router();


        app.use('/user', userRouter);

    }

}

module.exports = (app) => new usersRouter(app);
