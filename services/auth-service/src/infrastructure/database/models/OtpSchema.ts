import mongoose, { Document, Types , Schema } from "mongoose";

export interface OtpDocument extends Document {
    userId: Types.ObjectId;
    otp: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const OtpSchema = new Schema<OtpDocument>(
    {
        userId: {
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        otp:{
            type:String,
            required:true,
        },
        expiresAt:{
            type:Date,
            required:true
        }
    }
    , { timestamps: true })

export const OtpModel = mongoose.model<OtpDocument>("Otp", OtpSchema)
