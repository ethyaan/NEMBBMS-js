import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * global setup for JEST
 * here we initialize our in memory mongodb server once for all
 */
export default async function globalSetup() {
    const instance = await MongoMemoryServer.create({
        binary: { version: '5.0.10' }
    });
    const uri = instance.getUri();
    console.log('\n', 'Initiate Mongodb in-memory server', uri);
    console.log('MongoDB In-memory server URI => ', uri);
    global.__MONGOINSTANCE = instance;
    process.env.__JEST_MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
};