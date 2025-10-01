import nodemailer from "nodemailer"

export class EmailService{
    private transporter;

    constructor(){
        console.log('hited email service transporter');
        
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
            from:process.env.EMAIL_USER,
            to,
            subject:'Your OTP for WorkBee Registration',
            text:`Your OTP is: ${otp}, it will be expire in 5 minutes`
        }
        console.log(JSON.stringify(mailOption),'meilserviceeeeeeee')
        await this.transporter.sendMail(mailOption)
    }
}

