import { connectMongoDB, disconnectMongoDB } from '../services/index.js';

beforeAll(async () => {
    await connectMongoDB(process.env.__JEST_MONGO_URI, { dbName: 'JestTest', autoIndex: true });
});

afterAll(async () => {
    await disconnectMongoDB();
});