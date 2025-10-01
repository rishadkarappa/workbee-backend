import { OtpModel } from "../models/OtpSchema";
import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { Otp } from "../../../domain/entities/Otp";

export class MongoOtpRepository implements IOtpRepository{
    async save(otp: Otp): Promise<Otp> {
        const newOtp = new OtpModel(otp)
        const saved = await newOtp.save()

        return {
            id:saved.id,
            userId:saved.userId.toString(),
            otp:saved.otp,
            expiresAt:saved.expiresAt,
            createdAt:saved.createdAt
        }
    }

    async findByUserId(userId: string): Promise<Otp | null> {
        const otp = await OtpModel.findOne({userId})
        if(!otp) return null;
        return {
            id:otp.id,
            userId:otp.userId.toString(),
            otp:otp.otp,
            expiresAt:otp.expiresAt,
            createdAt:otp.createdAt
        }
    }

    async deleteByUserId(userId: string): Promise<void> {
        await OtpModel.deleteOne({userId})
    }
}


