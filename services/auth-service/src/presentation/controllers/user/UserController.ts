import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
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

@injectable()
export class UserController {
  constructor(
    @inject(RegisterUserUseCase) private registerUserUseCase: RegisterUserUseCase,
    @inject(LoginUserUseCase) private loginUserUseCase: LoginUserUseCase,
    @inject(VerifyOtpUseCase) private verifyOtpUseCase: VerifyOtpUseCase,
    @inject(VerifyUserUseCase) private verifyUserUseCase: VerifyUserUseCase,
    @inject(GoogleLoginUserUseCase) private googleLoginUserUseCase: GoogleLoginUserUseCase,
    @inject(ForgotPasswordUseCase) private forgotPasswordUseCase: ForgotPasswordUseCase,
    @inject(ResetPasswordUseCase) private resetPasswordUseCase: ResetPasswordUseCase
  ) {}

  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const result = await this.registerUserUseCase.execute(name, email, password);

      res
        .status(HttpStatus.CREATED)
        .json(ResponseHelper.success(result, ResponseMessage.OTP.SENT, HttpStatus.CREATED));
    } catch (err: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseHelper.error(err.message, HttpStatus.BAD_REQUEST));
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const { userId, otp } = req.body;

      const { user, token } = await this.verifyOtpUseCase.execute(userId, otp);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success({ user, token }, ResponseMessage.OTP.VERIFIED , HttpStatus.OK));
    } catch (err: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseHelper.error(err.message, HttpStatus.BAD_REQUEST));
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.loginUserUseCase.execute(email, password);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success({ user, token }, ResponseMessage.USER.LOGINED_SUCCESFULLY, HttpStatus.OK));
    } catch (err: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseHelper.error(err.message, HttpStatus.BAD_REQUEST));
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const user = await this.verifyUserUseCase.execute(req.headers.authorization);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(user, ResponseMessage.USER.VERFIFIED, HttpStatus.OK));
    } catch (err: any) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ResponseHelper.error(err.message, HttpStatus.UNAUTHORIZED));
    }
  }

  async googleLogin(req:Request, res:Response){
    try {
      const {credential} = req.body;
      const { user, token } = await this.googleLoginUserUseCase.execute(credential)
      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success({user, token}, ResponseMessage.USER.LOGINED_SUCCESFULLY, HttpStatus.OK))

    } catch (err:any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseHelper.error(err.message, HttpStatus.BAD_REQUEST))
    }
  }

  async forgotPassword(req:Request, res:Response) {
    try {
      console.log('hited contoller forgot passs')
      const { email } = req.body;

      const result = await this.forgotPasswordUseCase.execute(email)
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
  
  async resetPassword(req:Request, res:Response){
    try {
      console.log("bodycontets",req.body)
      const { token} = req.params
      const { password} = req.body
      console.log(password)
      console.log('passssss',req.body.passoword)

      const result = await this.resetPasswordUseCase.execute(token, password)
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

