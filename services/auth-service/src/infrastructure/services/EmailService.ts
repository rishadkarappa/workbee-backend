import { injectable } from "tsyringe";
import nodemailer from "nodemailer"
import { IEmailService } from "../../domain/services/IEmailService";

@injectable()
export class EmailService implements IEmailService{
    private transporter;

    constructor(){
        console.log('hited email service transporter seviceeeee');
        
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
        // console.log(JSON.stringify(mailOption),'meilserviceeeeeeee')
        await this.transporter.sendMail(mailOption)
    }

    //forgot pass reset link
    async sendResentPasswordLink(to:string, link:string){
        const mailOption = {
            from:process.env.EMAIL_USER,
            to,
            subject:"WorkBee - Reset Password Link",
            text: `Click the following link to reset you WorkBee password : ${link}\n this link will expire after 10 minutes`
        }
        await this.transporter.sendMail(mailOption)
    }
}

