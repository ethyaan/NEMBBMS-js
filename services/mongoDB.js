import mongoose from 'mongoose';
import * as url from 'url';

/**
 * create a connection to mongoDB
 * @param {*} mongoURI 
 * @param {*} dbName 
 * @returns 
 */
export const connectMongoDB = (mongoURI, options) => {

    const connectionOptions = {
        autoIndex: false,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 60000,
        family: 4
    };
    Object.assign(connectionOptions, options)
    const mondoDBURI = mongoURI ?? '';
    const mongoHost = new url.URL(mondoDBURI).host;
    mongoose.set('strictQuery', true);

    return new Promise(async (resolve, reject) => {
        try {
            await mongoose.connect(mondoDBURI, connectionOptions);
            console.log(`\x1b[32m`, `Connected to mongoDB at ${mongoHost}`, `\x1b[0m`);
            resolve(true);
        } catch (err) {
            console.log(`\x1b[31m`, 'Error connecting mongoDB => ', err, `\x1b[0m`);
            reject(true);
        }
    });
};

/**
 * close the mongodb connection 
 */
export const disconnectMongoDB = async () => {
    await mongoose.disconnect();
    console.log('disconnected');
}