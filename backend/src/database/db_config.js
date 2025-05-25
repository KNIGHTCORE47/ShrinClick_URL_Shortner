import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';
import 'dotenv/config';

const MAX_RETRY_ATTEMPTS = 5;
const RETRY_INTERVAL = 5000; // 5 second


class DatabaseConnection {
    constructor() {
        this.retryCount = 0;
        this.isConnected = false;

        // NOTE - Mongoose Strict Mode
        mongoose.set('strictQuery', true);

        // NOTE - Check for MongoDB Connection [on success, set isConnected to true]
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully.');
            this.isConnected = true;
        });


        // NOTE - Check for MongoDB Connection [on error, set isConnected to false]
        mongoose.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
            this.isConnected = false;
        });


        // NOTE - Check for MongoDB Connection [on disconnected, attempt to reconnect]
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
            this.handleDisconnection();
        });


        // NOTE - Check for MongoDB Connection [on termination]
        process.on("SIGTERM", this.handleAppTermination.bind(this));
    }


    // NOTE - Connect to MongoDB [Method]
    async connect() {
        try {
            // NOTE - Check for MongoDB Connection String
            if (!process.env.MONGODB_URI) {
                throw new Error('MONGO_URI environment variable is not set.');
            }

            // NOTE - Configure mongoose Connection Options
            const options = {
                dbName: DB_NAME,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                family: 4
            }

            // NOTE - Check for coding environment [toggle debug mode]
            if (process.env.NODE_ENV.toString() === 'development') {
                mongoose.set('debug', true);
            }

            await mongoose.connect(process.env.MONGODB_URI.toString(), options);

            // NOTE - Set retry count to 0
            this.retryCount = 0;

        } catch (error) {
            console.error('Error connecting to MongoDB:', error.message);

            // NOTE - Handle Connection Error
            await this.handleConnectionError();
        }
    }


    // NOTE - Handle Connection Error [Method]
    async handleConnectionError() {
        if (this.retryCount < MAX_RETRY_ATTEMPTS) {
            this.retryCount++;

            console.log(`Retrying to connect to MongoDB (Attempt ${this.retryCount}/${MAX_RETRY_ATTEMPTS})`);

            // NOTE - Wait for 5 seconds [retry_interval] before retrying
            await new Promise(resolve =>
                setTimeout(resolve, RETRY_INTERVAL)
            );

            // NOTE - Reconnect to MongoDB
            await this.connect();
        } else {
            console.error(`Failed to connect to MongoDB after ${MAX_RETRY_ATTEMPTS} attempts. Exiting...`);

            // NOTE - Exit the process with a non-zero exit code to indicate failure
            process.exit(1);
        }
    }


    // NOTE - Handle Disconnection [Method]
    async handleDisconnection() {
        if (!this.isConnected) {
            console.log('MongoDB is not connected. Attempting to reconnect...');

            await this.connect();
        }
    }


    // NOTE - Handle App Termination [Method]
    async handleAppTermination() {
        try {
            // NOTE - Disconnect from MongoDB
            await mongoose.disconnect();

            console.log('MongoDB connection closed through app termination.');

            process.exit(0);

        } catch (error) {
            console.error('Error handling app termination:', error.message);

            // NOTE - Exit the process with a non-zero exit code to indicate failure
            process.exit(1);
        }
    }


    // NOTE - Mongoose Connection Status [Method]
    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            retryCount: this.retryCount,
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name
        };
    }
}


// NOTE - Database Connection [Singleton Instance]
const dbConnection = new DatabaseConnection();


// NOTE - Connect to MongoDB [Method]
export default dbConnection.connect.bind(dbConnection);


// NOTE - Mongoose Connection Status [Method]
export const getConnectionStatus = dbConnection.getConnectionStatus.bind(dbConnection);
