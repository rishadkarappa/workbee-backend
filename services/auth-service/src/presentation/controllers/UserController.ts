import { Request, Response } from "express";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { MongoUserRepository } from "../../infrastructure/database/repositories/MongoUserRepository";
import { HashService } from "../../infrastructure/services/HashService";
import { TokenService } from "../../infrastructure/services/TokenService";

const userRepo = new MongoUserRepository();
const hashService = new HashService()
const tokenService = new TokenService()

const registerUser = new RegisterUser(userRepo, hashService);
const loginUser = new LoginUser(userRepo, hashService, tokenService)

export class UserContoller {

  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const user = await registerUser.execute(name, email, password)
      res.json({ success: true, user })
    }catch(err:any){
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



