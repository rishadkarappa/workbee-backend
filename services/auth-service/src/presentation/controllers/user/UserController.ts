import { NextFunction, Request, Response } from "express";
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
import { RefreshTokenRequestDTO } from "../../../application/dtos/user/RefreshTokenDTO";
import { RefreshTokenUseCase } from "../../../application/use-cases/user/RefreshTokenUseCase";
import { LogoutUserUseCase } from "../../../application/use-cases/user/LogoutUserUseCase";
import { IResendOtpUseCase } from "../../../application/ports/user/IResendOtpUseCase";
import { ResendOtpRequestDTO } from "../../../application/dtos/user/ResendOtpDTO";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject("RegisterUserUseCase") private _registerUserUseCase: IRegisterUserUseCase,
    @inject("LoginUserUseCase") private _loginUserUseCase: ILoginUserUseCase,
    @inject("VerifyOtpUseCase") private _verifyOtpUseCase: IVerifyOtpUseCase,
    @inject("ResendOtpUseCase") private _resendOtpUseCase: IResendOtpUseCase,
    @inject("VerifyUserUseCase") private _verifyUserUseCase: IVerifyUserUseCase,
    @inject("GoogleLoginUserUseCase") private _googleLoginUserUseCase: IGoogleLoginUserUseCase,
    @inject("ForgotPasswordUseCase") private _forgotPasswordUseCase: IForgotPasswordUseCase,
    @inject("ResetPasswordUseCase") private _resetPasswordUseCase: IResetPasswordUseCase,
    @inject("RefreshTokenUseCase") private _refreshTokenUseCase: RefreshTokenUseCase,
    @inject("LogoutUserUseCase") private _logoutUserUseCase: LogoutUserUseCase,
  ) { }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: RegisterUserRequestDTO = req.body;

      const result = await this._registerUserUseCase.execute(dto);

      res
        .status(HttpStatus.CREATED)
        .json(ResponseHelper.success(result, ResponseMessage.OTP.SENT, HttpStatus.CREATED));
    } catch (err) {
      next(err)
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: VerifyOtpRequestDTO = req.body;
      const result = await this._verifyOtpUseCase.execute(dto);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(result, ResponseMessage.OTP.VERIFIED, HttpStatus.OK));
    } catch (err) {
      next(err)
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: ResendOtpRequestDTO = req.body;

      const result = await this._resendOtpUseCase.execute(dto);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(result, "ResponseMessage.OTP.RESENT", HttpStatus.OK));
    } catch (err) {
      next(err)
    }
  }



  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: LoginUserRequestDTO = req.body;

      const result = await this._loginUserUseCase.execute(dto);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(result, ResponseMessage.USER.LOGINED_SUCCESFULLY, HttpStatus.OK));
    } catch (err) {
      next(err)
    }
  }

  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this._verifyUserUseCase.execute(req.headers.authorization);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(user, ResponseMessage.USER.VERFIFIED, HttpStatus.OK));
    } catch (err) {
      next(err)
    }
  }

  async googleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: GoogleLoginRequestDTO = req.body;
      const result = await this._googleLoginUserUseCase.execute(dto);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(result, ResponseMessage.USER.LOGINED_SUCCESFULLY, HttpStatus.OK));
    } catch (err) {
      next(err)
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('hited contoller forgot passs')
      const { email } = req.body;

      const result = await this._forgotPasswordUseCase.execute(email)
      console.log('rrrrrrr', result)
      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success({ result }, ResponseMessage.USER.SENT_RESET_LINK, HttpStatus.OK))
    } catch (error: any) {
      next(error)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("bodycontets", req.body)
      const { token } = req.params
      const { password } = req.body
      console.log(password)
      console.log('passssss', req.body.passoword)

      const result = await this._resetPasswordUseCase.execute(token, password)
      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success({ result }, ResponseMessage.USER.PASSOWORD_UPDATED, HttpStatus.OK))
    } catch (error) {
      next(error)
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: RefreshTokenRequestDTO = req.body;

      if (!dto.refreshToken) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(ResponseHelper.error("Refresh token is required", HttpStatus.BAD_REQUEST));
        return;
      }

      const result = await this._refreshTokenUseCase.execute(dto);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(result, "Token refreshed successfully", HttpStatus.OK));
    } catch (error) {
      console.error("RefreshTokenController Error:", error);
      next(error);
    }
  }

  async userLogout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get userId from JWT payload (set by gateway middleware)
      const userId = req.headers['x-user-id'] as string;

      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ResponseHelper.error("User not authenticated", HttpStatus.UNAUTHORIZED));
        return;
      }

      await this._logoutUserUseCase.execute(userId);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(null, "Logged out successfully", HttpStatus.OK));
    } catch (error) {
      console.error("LogoutController Error:", error);
      next(error);
    }
  }
}

