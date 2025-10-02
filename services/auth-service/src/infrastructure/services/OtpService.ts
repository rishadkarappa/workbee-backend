import { injectable } from "tsyringe"

@injectable()
export class OtpService {
    generateOtp() : Number {
        return Math.floor(10000 + Math.random() * 90000)
    }
}


