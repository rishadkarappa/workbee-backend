import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "../../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../../shared/helpers/responseHelper";
import { ResponseMessage } from "../../../shared/constants/ResponseMessages";

import { RegisterUserRequestDTO } from "../../../application/dtos/user/RegisterUserDTO";
import { LoginUserRequestDTO } from "../../../application/dtos/user/LoginUserDTO";
import { VerifyOtpRequestDTO } from "../../../application/dtos/user/VerifyOtpDTO";
import { GoogleLoginRequestDTO } from "../../../application/dtos/user/GoogleLoginDTO";

import { IRegisterUserUseCase } from "../../../application/ports/user/IRegisterUserUseCase";
import { ILoginUserUseCase } from "../../../application/ports/user/ILoginUserUseCase";
import { IVerifyOtpUseCase } from "../../../application/ports/user/IVerifyOtpUseCase";
import { IVerifyUserUseCase } from "../../../application/ports/user/IVerifyUserUseCase";
import { IGoogleLoginUserUseCase } from "../../../application/ports/user/IGoogleLoginUserUseCase";
import { IForgotPasswordUseCase } from "../../../application/ports/user/IForgotPasswordUseCase";
import { IResetPasswordUseCase } from "../../../application/ports/user/IResetPasswordUseCase";
import { IUserController } from "../../ports/IUserContoller";

@injectable()
export class UserController implements IUserController{
  constructor(
    @inject("RegisterUserUseCase") private registerUserUseCase: IRegisterUserUseCase,
    @inject("LoginUserUseCase") private loginUserUseCase: ILoginUserUseCase,
    @inject("VerifyOtpUseCase") private verifyOtpUseCase: IVerifyOtpUseCase,
    @inject("VerifyUserUseCase") private verifyUserUseCase: IVerifyUserUseCase,
    @inject("GoogleLoginUserUseCase") private googleLoginUserUseCase: IGoogleLoginUserUseCase,
    @inject("ForgotPasswordUseCase") private forgotPasswordUseCase: IForgotPasswordUseCase,
    @inject("ResetPasswordUseCase") private resetPasswordUseCase: IResetPasswordUseCase
  ) {}

  async register(req: Request, res: Response) {
    try {
      const dto: RegisterUserRequestDTO = req.body;

      const result = await this.registerUserUseCase.execute(dto);

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
      const dto:VerifyOtpRequestDTO = req.body
      const { user, token } = await this.verifyOtpUseCase.execute(dto);

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
      const dto:LoginUserRequestDTO = req.body

      const { user, token } = await this.loginUserUseCase.execute(dto);

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
      const dto:GoogleLoginRequestDTO = req.body
      const { user, token } = await this.googleLoginUserUseCase.execute(dto)
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

