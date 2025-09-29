import { Request, Response } from "express";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { MongoUserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { HashService } from "../../infrastructure/services/HashService";
import { TokenService } from "../../infrastructure/services/TokenService";
import { OtpRepository } from "../../infrastructure/database/repositories/OtpRepository";
import { OtpService } from "../../infrastructure/services/OtpService";
import { VerifyOtp } from "../../application/use-cases/VerifyOtp";
import { EmailService } from "../../infrastructure/services/EmailService";

const userRepo = new MongoUserRepository();
const optRepo = new OtpRepository()
const hashService = new HashService()
const tokenService = new TokenService()
const otpService = new OtpService()
const emailService = new EmailService();

const registerUser = new RegisterUser(userRepo, optRepo, hashService, otpService, emailService);
const loginUser = new LoginUser(userRepo, hashService, tokenService)
const verifyOtp = new VerifyOtp(userRepo, optRepo, tokenService)

export class UserContoller {

  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const result = await registerUser.execute(name, email, password)
      res.json({ success: true, ...result })
    }catch(err:any){
      res.status(400).json({success:false,message:err.message})
    }
  }

  static async verifyOtp(req:Request,res:Response){
    try {
      const {userId, otp} = req.body;
      const {user, token} = await verifyOtp.execute(userId, otp)
      res.json({success:true,user, token})
    } catch (err:any) {
      res.status(400).json({success:false,message:err.message})
    }
  }

  static async login(req:Request,res:Response) {
    try{
      const { email, password} = req.body;
      const { user , token} = await loginUser.execute(email, password)
      res.json({success:true,user, token})

    }catch(err:any){
      res.status(400).json({success:false, message:err.message})
    }
  }
}



