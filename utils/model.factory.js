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
		this.modelName = model.collection.collectionName;
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
			const options = { statusCode: 500, msg: parsedError, errorCode: 'DBERROR' };
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
		let preparedQuery;
		if (!!find) {
			preparedQuery = this.model.find(query, projection || {}, options || {});
			if (find.limit) { preparedQuery.limit(find.limit); }
		} else {
			preparedQuery = this.model.findOne(query, projection || {}, options || {});
		}
		const { error, data } = await this.asyncWrapper(preparedQuery.exec());
		if (error) {
			const parsedError = this.mongooseErrorHandler(error);
			logger.error(`DB=>${this.modelName}=>findEntityByParams : `, parsedError);
			return createError({ msg: parsedError, statusCode: 500, errorCode: 'DBERROR' });
		} else {
			logger.log(`DB=>${this.modelName}=>findEntityByParams : `, data);
			return Promise.resolve(data);
		}
	}

	/**
	 * find entity with pagination required parameters
	 * @param query
	 * @param projection
	 * @param options
	 * @param pagination
	 */
	async findEntityByParamsPagination(query, projection, options, pagination) {
		const { error: countError, data: count } = await this.asyncWrapper(this.model.countDocuments(query).exec());
		if (countError) {
			const parsedError = this.mongooseErrorHandler(countError);
			logger.error(`DB=>${this.modelName}=>findEntityByParamsPagination=>countDocuments : `, parsedError);
			return createError({ msg: parsedError, statusCode: 500, errorCode: 'DBERROR' });
		}
		const skip = (pagination.pageNumber - 1) * pagination.limit;
		const { error, data } = await this.asyncWrapper(this.model.find(query, projection || {}, options || {}).skip(skip).limit(pagination.limit).lean());
		if (error) {
			const parsedError = this.mongooseErrorHandler(error);
			logger.error(`DB=>${this.modelName}=>findEntityByParamsPagination=>find : `, parsedError);
			return createError({ msg: parsedError, statusCode: 500, errorCode: 'DBERROR' });
		}
		const result = { totalRecords: count, data };
		logger.log(`DB=>${this.modelName}=>findEntityByParamsPagination : `, JSON.stringify(result));
		return Promise.resolve(result);
	}

	/**
	 * update Entity info by previous model
	 * @param model
	 * @param properties
	 */
	async updateEntityByModel(model, properties) {
		Object.assign(model, properties);
		const { error, data } = await this.asyncWrapper(model.save());
		if (error) {
			const parsedError = this.mongooseErrorHandler(error);
			logger.error(`DB=>${this.modelName}=>updateEntityByModel: `, error);
			return createError({ msg: parsedError, statusCode: 500, errorCode: 'DBERROR' });
		}
		logger.log(`DB=>${this.modelName}=>updateEntityByModel : `, JSON.stringify(data));
		return Promise.resolve(data);
	}

	/**
	 * delete one single document
	 * @param query
	 * @param options
	 */
	async deleteEntity(query, options) {
		const { error, data } = await this.asyncWrapper(this.model.findOneAndRemove(query, options || {}).exec());
		if (error) {
			const parsedError = this.mongooseErrorHandler(error);
			logger.error(`Model=>${this.modelName}=>deleteEntity : `, parsedError);
			return createError({ msg: parsedError, statusCode: 500, errorCode: 'DBERROR' });
		} else {
			logger.log(`DB=>${this.modelName}=>deleteEntity : `, data);
			return Promise.resolve(data);
		}
	}

	/**
	 * a simple wrapper to catch rejected promise without try, catch block
	 * @param promise
	 */
	asyncWrapper(promise) {
		return promise.then((data) => ({ error: null, data })).catch((error) => ({ error, data: null }));
	}

	/**
	 * parse mongoose Error Object and extract information
	 * @param err
	 */
	mongooseErrorHandler(err) {
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