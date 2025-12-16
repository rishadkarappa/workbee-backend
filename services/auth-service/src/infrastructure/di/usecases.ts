import { container } from "tsyringe";

//user
import { RegisterUserUseCase } from "../../application/use-cases/user/RegisterUserUseCase";
import { LoginUserUseCase } from "../../application/use-cases/user/LoginUserUseCase";
import { VerifyUserUseCase } from "../../application/use-cases/user/VerifyUserUseCase";
import { GoogleLoginUserUseCase } from "../../application/use-cases/user/GoogleLoginUserUseCase";
import { ForgotPasswordUseCase } from "../../application/use-cases/user/ForgotUserPasswordUseCase";
import { ResetPasswordUseCase } from "../../application/use-cases/user/ResetUserPasswordUseCase";
import { VerifyOtpUseCase } from "../../application/use-cases/user/VerifyOtpUseCase";

//admin
import { LoginAdminUseCase } from "../../application/use-cases/admin/LoginAdminUseCase";
import { GetUsersUseCase } from "../../application/use-cases/admin/GetUsersUseCase";


import { ILoginUserUseCase } from "../../application/ports/user/ILoginUserUseCase";
import { IRegisterUserUseCase } from "../../application/ports/user/IRegisterUserUseCase";
import { IVerifyUserUseCase } from "../../application/ports/user/IVerifyUserUseCase";
import { IGoogleLoginUserUseCase } from "../../application/ports/user/IGoogleLoginUserUseCase";
import { IForgotPasswordUseCase } from "../../application/ports/user/IForgotPasswordUseCase";
import { IResetPasswordUseCase } from "../../application/ports/user/IResetPasswordUseCase";
import { IVerifyOtpUseCase } from "../../application/ports/user/IVerifyOtpUseCase";
import { ILoginAdminUseCase } from "../../application/ports/admin/ILoginAdminUseCase";
import { IGetUsersUseCase } from "../../application/ports/admin/IGetUsersUseCase";
import { IWorkerLoginUseCase } from "../../application/ports/worker/IWorkerLoginUseCase";

//worker
import { WorkerLoginUseCase } from "../../application/use-cases/worker/WorkerLoginUseCase";
import { IBlockUserUseCase } from "../../application/ports/admin/IBlockUserUseCase";
import { BlockUserUseCase } from "../../application/use-cases/admin/BlockUserUseCase";
import { RefreshTokenUseCase } from "../../application/use-cases/user/RefreshTokenUseCase";
import { LogoutUserUseCase } from "../../application/use-cases/user/LogoutUserUseCase";
import { IRefreshTokenUseCase } from "../../application/ports/user/IRefreshTokenUseCase";
import { ILogoutUserUseCase } from "../../application/ports/user/ILogoutUserUseCase";
import { ResendOtpUseCase } from "../../application/use-cases/user/ResendOtpUseCase";
import { IResendOtpUseCase } from "../../application/ports/user/IResendOtpUseCase";


//usecases will injected by auto via @inject
//user

container.registerSingleton<ILoginUserUseCase>("LoginUserUseCase",LoginUserUseCase)
container.registerSingleton<IRegisterUserUseCase>("RegisterUserUseCase",RegisterUserUseCase)
container.registerSingleton<IVerifyUserUseCase>("VerifyUserUseCase",VerifyUserUseCase);
container.registerSingleton<IGoogleLoginUserUseCase>("GoogleLoginUserUseCase",GoogleLoginUserUseCase)
container.registerSingleton<IForgotPasswordUseCase>("ForgotPasswordUseCase",ForgotPasswordUseCase)
container.registerSingleton<IResetPasswordUseCase>("ResetPasswordUseCase",ResetPasswordUseCase)
container.registerSingleton<IVerifyOtpUseCase>("VerifyOtpUseCase",VerifyOtpUseCase)
container.registerSingleton<IResendOtpUseCase>("ResendOtpUseCase",ResendOtpUseCase)
container.register<IRefreshTokenUseCase>("RefreshTokenUseCase", RefreshTokenUseCase);
container.register<ILogoutUserUseCase>("LogoutUserUseCase", LogoutUserUseCase);

//admin
container.registerSingleton<ILoginAdminUseCase>("LoginAdminUseCase",LoginAdminUseCase)
container.registerSingleton<IGetUsersUseCase>("GetUsersUseCase",GetUsersUseCase)
container.registerSingleton<IBlockUserUseCase>("BlockUserUseCase",BlockUserUseCase)

//worker
container.registerSingleton<IWorkerLoginUseCase>("WorkerLoginUseCase",WorkerLoginUseCase)