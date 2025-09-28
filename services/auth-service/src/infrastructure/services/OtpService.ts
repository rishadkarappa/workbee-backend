export class OtpService {
    generateOtp() : Number {
        let otp = Math.floor(10000 + Math.random() * 90000)
        return otp
    }
}


