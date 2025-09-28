import mongoose from "mongoose";

export const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI||"mongodb://localhost:27017/workbee-auth-service")
        console.log('mongodb connected')
    }catch(err){
        console.log('database connection failed',err)
        process.exit(1)
    }
};

