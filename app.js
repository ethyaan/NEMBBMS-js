import express from 'express';
import cors from 'cors';
// import expressValidator from 'express-validator';
// import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from './swagger.json';

import modules from './modules/index.js';
import { handleError } from './services/error.js';

const app = express();

app._E = handleError;

app.use(express.json());
app.use(cors({
	'allowedHeaders': ['Content-Type', 'Authorization'],
	'exposedHeaders': ['Content-Type', 'Authorization'],
	// credentials: true,
	// methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
	// origin: `*`,
	// preflightContinue: false
}));

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', (request, response) => {
	return response.send('healthy');
});

modules(app);

export default app;
