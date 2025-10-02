import { Request, Response } from "express";
import { container } from "tsyringe";

import { RegisterUserUseCase } from "../../../application/use-cases/user/RegisterUserUseCase";
import { LoginUserUseCase } from "../../../application/use-cases/user/LoginUserUseCase";
import { VerifyOtpUseCase } from "../../../application/use-cases/user/VerifyOtpUseCase";
import { VerifyUserUseCase } from "../../../application/use-cases/user/VerifyUserUseCase";

export class UserController {

  static async register(req: Request, res: Response) {
    try {
      // console.log('hited regiter')
      console.log('req,body',req.body)

      const registerUser = container.resolve(RegisterUserUseCase)
      
      const { name, email, password } = req.body;
      const result = await registerUser.execute(name, email, password)
      // console.log('kitteeeeeeeeeeeee',result)
      res.json({ success: true, ...result })
    }catch(err:any){
      res.status(400).json({success:false,message:err.message})
    }
  }

  static async verifyOtp(req:Request,res:Response){
    try {
      console.log('vefify otp hited')

      const verifyOtp = container.resolve(VerifyOtpUseCase)

      const {userId, otp} = req.body;
      const {user, token} = await verifyOtp.execute(userId, otp)
      res.json({success:true,user, token})
    } catch (err:any) {
      res.status(400).json({success:false,message:err.message})
    }
  }

  static async login(req:Request,res:Response) {
    try{

      const loginUser = container.resolve(LoginUserUseCase)

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

      const verifyUser = container.resolve(VerifyUserUseCase)

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



