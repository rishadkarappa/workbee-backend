import { Request, Response } from "express";
import { container } from "tsyringe";
import { HttpStatus } from "../../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../../shared/helpers/responseHelper";
import { ResponseMessage } from "../../../shared/constants/ResponseMessages";

import { RegisterUserUseCase } from "../../../application/use-cases/user/RegisterUserUseCase";
import { LoginUserUseCase } from "../../../application/use-cases/user/LoginUserUseCase";
import { VerifyOtpUseCase } from "../../../application/use-cases/user/VerifyOtpUseCase";
import { VerifyUserUseCase } from "../../../application/use-cases/user/VerifyUserUseCase";
import { GoogleLoginUserUseCase } from "../../../application/use-cases/user/GoogleLoginUserUseCase";
import { ForgotPasswordUseCase } from "../../../application/use-cases/user/ForgotUserPasswordUseCase";
import { ResetPasswordUseCase } from "../../../application/use-cases/user/ResetUserPasswordUseCase";

export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const registerUser = container.resolve(RegisterUserUseCase);
      const { name, email, password } = req.body;

      const result = await registerUser.execute(name, email, password);

      res
        .status(HttpStatus.CREATED)
        .json(ResponseHelper.success(result, ResponseMessage.OTP.SENT, HttpStatus.CREATED));
    } catch (err: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseHelper.error(err.message, HttpStatus.BAD_REQUEST));
    }
  }

  static async verifyOtp(req: Request, res: Response) {
    try {
      const verifyOtp = container.resolve(VerifyOtpUseCase);
      const { userId, otp } = req.body;

      const { user, token } = await verifyOtp.execute(userId, otp);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success({ user, token }, ResponseMessage.OTP.VERIFIED , HttpStatus.OK));
    } catch (err: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseHelper.error(err.message, HttpStatus.BAD_REQUEST));
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const loginUser = container.resolve(LoginUserUseCase);
      const { email, password } = req.body;

      const { user, token } = await loginUser.execute(email, password);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success({ user, token }, ResponseMessage.USER.LOGINED_SUCCESFULLY, HttpStatus.OK));
    } catch (err: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseHelper.error(err.message, HttpStatus.BAD_REQUEST));
    }
  }

  static async verify(req: Request, res: Response) {
    try {
      const verifyUser = container.resolve(VerifyUserUseCase);
      const user = await verifyUser.execute(req.headers.authorization);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(user, ResponseMessage.USER.VERFIFIED, HttpStatus.OK));
    } catch (err: any) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ResponseHelper.error(err.message, HttpStatus.UNAUTHORIZED));
    }
  }

  static async googleLogin(req:Request, res:Response){
    try {
      const googleLogin = container.resolve(GoogleLoginUserUseCase)
      const {credential} = req.body;
      const { user, token } = await googleLogin.execute(credential)
      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success({user, token}, ResponseMessage.USER.LOGINED_SUCCESFULLY, HttpStatus.OK))

    } catch (err:any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseHelper.error(err.message, HttpStatus.BAD_REQUEST))
    }
  }

  static async forgotPassword(req:Request, res:Response) {
    try {
      console.log('hited contoller forgot passs')
      const { email } = req.body;
      const forgotPassword = container.resolve(ForgotPasswordUseCase)
      const result = await forgotPassword.execute(email)
      console.log('rrrrrrr',result)
      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success({result},ResponseMessage.USER.SENT_RESET_LINK, HttpStatus.OK))
    } catch (error:any) {
      res 
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST))
    }
  }
  
  static async resetPassword(req:Request, res:Response){
    try {
      console.log("bodycontets",req.body)
      const { token} = req.params
      const { password} = req.body
      console.log(password)
      console.log('passssss',req.body.passoword)
      const resetPassword = container.resolve(ResetPasswordUseCase)
      const result = await resetPassword.execute(token, password)
      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success({result}, ResponseMessage.USER.PASSOWORD_UPDATED, HttpStatus.OK))
    } catch (error:any) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST))
    }
  }
}

