import mongoose  from "mongoose";
import { logger } from "../logger/logger";
import { ENV } from "./env";

export const connectDatabase = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI)
        logger.info('mongodb connected')
    } catch (error) {
        logger.info('database conection failded',error)
        process.exit(1)
    }
}


