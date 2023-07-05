import config from './config.js';
import { Logger } from './common/index.js';
import { connectMongoDB } from './services/index.js';
import app from './app.js';

const startServer = async () => {
	try {
		await connectMongoDB(config.MONGO_URI, { dbName: config.DBNAME });
		app.listen(config.PORT, () => {
			Logger.success(`App listening on port ${config.PORT}`);
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		Logger.error(`Could not start the app: `, error);
	}
};

startServer();