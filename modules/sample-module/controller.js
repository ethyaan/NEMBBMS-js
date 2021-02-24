/**
 * Define Sample module
 * @type Class
 */
class sampleController {
    /**
     * constructor to Set routing NameSpace and registering the routes
     * @param app
     */
    constructor(app) {
        
    }

    async sampleAPI(req, res) {
        try {
            res.send({ message: 'sample API works' });
        } catch(error) {
            console.log(error);
        }
    }

}

module.exports = (app) => new sampleController(app);
