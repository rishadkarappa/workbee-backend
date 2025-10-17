import { injectable } from "tsyringe"

import { IOtpService } from "../../domain/services/IOtpService"

@injectable()
export class OtpService implements IOtpService{
    generateOtp() : Number {
        return Math.floor(10000 + Math.random() * 90000)
    }
}


