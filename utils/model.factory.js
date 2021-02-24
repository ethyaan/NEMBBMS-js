const logger = require('../services/logger');
class MasterModel {

	model = null;
	modelName = '';
	/**
	 * implement constructor method
	 */
	constructor(model) {
		this.model = model;
		this.modelName = model.collection?.collectionName;
	}

    /**
	 * get the model Object
	 */
	getModel() {
		return this.model;
	}

    /**
	 * get Entity details from params and insert into the DB, return Object inside the Promise
	 * @param EntityObject
	 */
    async createEntity(EntityObject) {

    }

    /**
	 * find Entity by specified query
	 * @param query
	 * @param projection
	 * @param options
	 * @param find
	 */
    async findEntityByParams(query, projection, options, find) {

    }

    /**
	 * find entity with pagination required parameters
	 * @param query
	 * @param projection
	 * @param options
	 * @param pagination
	 */
    async findEntityByParamsPagination(query, projection, options, pagination) {

    }

    /**
	 * update Entity info by previous model
	 * @param model
	 * @param properties
	 */
	async updateEntityByModel(model, properties) {

    }

    /**
	 * delete one single document
	 * @param query
	 * @param options
	 */
	async deleteEntity(query, options) {

    }

    /**
	 * parse mongoose Error Object and extract information
	 * @param err
	 */
	mongooseErrorHandler (err) {
		const response = {};
		if (!err) {
			return err;
		} else if (err.errors) {
			Object.keys(err.errors).forEach((item) => {
				response[item] = err.errors[item].message;
			});
			return response;
		} else {
			return err.toString();
		}
	}

}

module.exports = MasterModel;