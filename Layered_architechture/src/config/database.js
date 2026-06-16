import mongoose from "mongoose";
import { config } from "./index.js";

class Database{
    static async connect(){
        try {
            const mongoUri= config.mongodb.uri;
            if(!mongoUri){
                throw new Error("MongoDB URI is not defined");
            }
            const options = {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            }

            await mongoose.connect(mongoUri, options);
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            process.exit(1);
        }
    }

    static async disconnect(){
        try {
            await mongoose.disconnect();
            console.log("Disconnected from MongoDB");
        } catch (error) {
            console.error("Error disconnecting from MongoDB:", error);
            process.exit(1);
        }
    }
}

export default Database;