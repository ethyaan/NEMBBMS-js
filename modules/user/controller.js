const createModel = require('../../common/model-factory');
const { UserModel } = require('./schema');

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

		this.model = createModel(UserModel);
	}

	async createUser(req, res) {
		try {

		} catch(error) {
			console.log(error);
		}
	}

}

module.exports = (app) => new userController(app);
