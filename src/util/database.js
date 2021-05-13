//database.js
//module import
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

mongoose.Promise = global.Promise;

export const memoryDB = new MongoMemoryServer();

export const dbConnOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
};

export const connectMongoDB = async () => {
    const dbUri = await memoryDB.getUri();

    await mongoose
        .connect(dbUri, dbConnOpts)
        .then(() => {
            console.log(`Successfully connected database!: ${dbUri}`);
        })
        .catch((error) => {
            console.log('error!');
        });
};
