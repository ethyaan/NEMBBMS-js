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

}

module.exports = MasterModel;