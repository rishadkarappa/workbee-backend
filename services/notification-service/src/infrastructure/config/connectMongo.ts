/**
 * Mongo db configuration connection
 */
import mongoose  from "mongoose";
import { ENV } from "./env";

export const connectDatabase = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI)
        console.log('mongodb connected')
    } catch (error) {
        console.log('database conection failded',error)
        process.exit(1)
    }
}
