import nodemailer from "nodemailer"

export class EmailService{
    private transporter;

    constructor(){
        this.transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASSKEY
            }
        })
    }

    async sendOtp(to:string,otp:string){
        const mailOption = {
            from:process.env.SENDER_EMAIL,
            to,
            subject:'Your OTP for WorkBee Registration',
            text:`Your OTP is: ${otp}, it will be expire in 5 minutes`
        }
    }
}

