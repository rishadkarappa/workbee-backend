import mongoose from "mongoose";

export const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log('work sevice mongodb connected')
    } catch (error) {
        console.log('worksevice mongodb connection failed',error)
        process.exit(1)
    }
}
