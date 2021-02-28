const express           = require('express');
const cors              = require('cors');
const path				= require('path');
const logger            = require('./services/logger');
const auth				= require('./services/authentication');


const app = express();
const modulesPath = path.join(__dirname, './modules');

app.use(express.urlencoded({ limit: '10mb', extended: false }));
app.use(express.json({ limit: '10mb' }));

const corsOptions = {
	'allowedHeaders': ['Content-Type', 'Authorization'],
	'exposedHeaders': ['Content-Type', 'Authorization'],
	// credentials: true,
	// methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
	// origin: `*`,
	// preflightContinue: false
};

app.use(cors(corsOptions));

app._Auth = auth;
// app._Captcha = reCaptcha;
// app._Permissions = [];

const getYear = (date) => {
	return `${date.getFullYear()}`;
};

app.get('/', (req, res) => {
	const year = getYear(new Date());
	res.send(`Hello World ! ${year}`);
});

/**
 * custom error response handler for API request field validation
 * used in express validator methods inside each module
 */
app.use((req, res, next) => {

	req._validationErrorHandler = (response, errorDetails) => {
		logger.validation('Field Validation Filed => ' + JSON.stringify(errorDetails));
		errorDetails = errorDetails.map((item) => {
			item.name = item.param;
			delete item.param;
			delete item.value;
			return item;
		});
		const error = { errorCode: 'VALIDATION-ERROR', fields: errorDetails };
		return response.status(400).send(error);
	};
	next();
});

require('fs').readdirSync(modulesPath).forEach(function(file) {
	require(path.join(__dirname, `./modules/${file}/route.js`))(app);
});


module.exports = app;
