import mongoose  from "mongoose";

export const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI||"mongodb://localhost:27017/workbee-communication-service")
        console.log('mongodb connected')
    } catch (error) {
        console.log('database conection failded',error)
        process.exit(1)
    }
}


