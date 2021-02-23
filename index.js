const express           = require('express');
const path              = require('path');
const dotenv            = require('dotenv').config({ path: path.join(__dirname, './.env') });
const mongoose          = require('mongoose');
const url               = require('url');
const config            = require('./config');
const logger            = require('./services/logger');
const app               = require('./app');

const mongoHost = new url.URL(config.MONGODB_URI).host;
const mongoPassword = encodeURIComponent(config.MONGODB_PASSWORD);
const mongoDBConnectionURI = config.MONGODB_URI.replace('_pwd_', mongoPassword);

const connectMongoDB = () => {

	const connectionOptions = {
		poolSize: 50,
		keepAlive: 120,
		useNewUrlParser: true,
		autoIndex: false,
		connectTimeoutMS: 10000,
		socketTimeoutMS: 45000,
		family: 4,
		useFindAndModify: false,
		useUnifiedTopology: true
	};

	return new Promise((resolve, reject) => {
        return resolve(true);
		// mongoose.connect(mongoDBConnectionURI, connectionOptions, async (err) => {
		// 	if (err) {
		// 		logger.error('Error connecting mongoDB => ', err);
		// 		return reject(true);
		// 	}
		// 	logger.success(`Connected to mongoDB at ${mongoHost}`);
		// 	return resolve(true);
		// });
	});
};

const startServer = async () => {
	try {
		// await connectMongoDB();
		// await app._Auth.connect();
		app.listen(config.PORT, () => {
			console.log(`App listening on port ${config.PORT}`);
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(`Could not start the app: `, error);
	}
};

startServer();