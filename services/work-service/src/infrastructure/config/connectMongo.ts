import mongoose from "mongoose";
import { ENV } from "./env";
import { logger } from "../logger/logger";

export const connectDatabase = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI)
        logger.info('work sevice mongodb connected')
    } catch (error) {
        logger.log('worksevice mongodb connection failed',error)
        process.exit(1)
    }
}
