export interface IEmailService {
    sendOtp(to:string, otp:string):Promise<void>;
    sendResentPasswordLink(to:string, link:string):Promise<void>;
}