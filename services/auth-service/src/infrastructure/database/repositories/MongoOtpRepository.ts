import { injectable } from "tsyringe";
import { OtpModel } from "../models/OtpSchema";
import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { Otp } from "../../../domain/entities/Otp";
import { MongoBaseRepository } from "./MongoBaseRepository";

// @injectable()
// export class MongoOtpRepository implements IOtpRepository{
//     async save(otp: Otp): Promise<Otp> {
//         const newOtp = new OtpModel(otp)
//         const saved = await newOtp.save()

//         return {
//             id:saved.id,
//             userId:saved.userId.toString(),
//             otp:saved.otp,
//             expiresAt:saved.expiresAt,
//             createdAt:saved.createdAt
//         }
//     }

//     async findByUserId(userId: string): Promise<Otp | null> {
//         const otp = await OtpModel.findOne({userId})
//         if(!otp) return null;
//         return {
//             id:otp.id,
//             userId:otp.userId.toString(),
//             otp:otp.otp,
//             expiresAt:otp.expiresAt,
//             createdAt:otp.createdAt
//         }
//     }

//     async deleteByUserId(userId: string): Promise<void> {
//         await OtpModel.deleteOne({userId})
//     }
// }

@injectable()
export class MongoOtpRepository extends MongoBaseRepository<Otp, any> implements IOtpRepository{

    constructor() {
        super(OtpModel)
    }

    protected map(otp: any): Otp {
        return {
            id:otp.id,
            userId:otp.userId.toString(),
            otp:otp.otp,
            expiresAt:otp.expiresAt,
            createdAt:otp.createdAt
        };
    }

    async save(otp: Otp): Promise<Otp> {
        const newOtp = new OtpModel(otp)
        const saved = await newOtp.save()
        return this.map(saved)
    }

    async findByUserId(userId: string): Promise<Otp | null> {
        const otp  = await OtpModel.findOne({userId})
        return otp?this.map(otp):null;
    }

    async deleteByUserId(userId: string): Promise<void> {
        await OtpModel.deleteOne({userId})
    }
}

