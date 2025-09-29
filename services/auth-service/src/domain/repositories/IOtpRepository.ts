import { Otp } from '../entities/Otp'

export interface IOtpRepository {
    save(otp:Otp):Promise<Otp>;
    findByUserId(userId:string):Promise<Otp|null>;
    deleteByUserId(userId:string):Promise<void>;
}