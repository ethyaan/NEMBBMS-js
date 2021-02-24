const logger = require('../services/logger');
const { createError } = require('../services/error');

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
        const entity = new this.model(EntityObject);
		const { error, data: newEntity } = await this.asyncWrapper(entity.save());
		if (error) {
			const parsedError = this.mongooseErrorHandler(error);
			const options = {statusCode: 500, msg: parsedError, errorCode: 'DBERROR'};
			logger.info(`DB=>(${this.modelName})Model=>createEntity : ${parsedError}`);
			return createError(options, {});
		}
		logger.success(`DB=>(${this.modelName})Model=>createEntity : new newEntity created `, newEntity);
		return Promise.resolve(newEntity);
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
	 * a simple wrapper to catch rejected promise without try, catch block
	 * @param promise
	 */
	asyncWrapper (promise) {
		return promise.then((data) => ({error: null, data})).catch((error) => ({error, data: null}));
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