import { Request, Response } from "express";

import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";

import { VerifyOtp } from "../../application/use-cases/VerifyOtp";
import { VerifyUser } from "../../application/use-cases/VerifyUser";

import { MongoUserRepository } from "../../infrastructure/database/repositories/MongoUserRepository";
import { MongoOtpRepository } from "../../infrastructure/database/repositories/MongoOtpRepository";

//services
import { HashService } from "../../infrastructure/services/HashService";
import { TokenService } from "../../infrastructure/services/TokenService";
import { OtpService } from "../../infrastructure/services/OtpService";
import { EmailService } from "../../infrastructure/services/EmailService";

const userRepo = new MongoUserRepository();
const optRepo = new MongoOtpRepository()

const hashService = new HashService()
const tokenService = new TokenService()
const otpService = new OtpService()
const emailService = new EmailService();

const registerUser = new RegisterUser(userRepo, optRepo, hashService, otpService, emailService);
const loginUser = new LoginUser(userRepo, hashService, tokenService)
const verifyOtp = new VerifyOtp(userRepo, optRepo, tokenService)
const verifyUser = new VerifyUser(userRepo, tokenService)

export class UserController {

  static async register(req: Request, res: Response) {
    try {
      console.log('hited regiter')
      console.log('req,body',req.body)
      const { name, email, password } = req.body;
      const result = await registerUser.execute(name, email, password)
      console.log('kitteeeeeeeeeeeee',result)
      res.json({ success: true, ...result })
    }catch(err:any){
      res.status(400).json({success:false,message:err.message})
    }
  }

  static async verifyOtp(req:Request,res:Response){
    try {
      console.log('vefify otp hited')
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

  //check the user is logined or registed 
  static async verify(req:Request, res:Response) {
    try{
      const authHeader = req.headers.authorization;
      if(!authHeader) throw new Error('autherztion headr is missing when check the user is logined or not')
        const token = authHeader.split(" ")[1]
      if(!token) throw new Error('token is missing when verify user')
        const user = await verifyUser.execute(token)
      res.json({success:true,user})
    }catch(err:any){
      console.log(err,'error accured when verify userrrrr')
      res.status(401).json({success:true,message:err.message})
    }
  }
}



