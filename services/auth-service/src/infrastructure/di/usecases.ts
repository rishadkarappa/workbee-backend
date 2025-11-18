
// import { container } from "tsyringe";

// //user
// import { RegisterUserUseCase } from "../../application/use-cases/user/RegisterUserUseCase";
// import { LoginUserUseCase } from "../../application/use-cases/user/LoginUserUseCase";
// import { VerifyUserUseCase } from "../../application/use-cases/user/VerifyUserUseCase";
// import { GoogleLoginUserUseCase } from "../../application/use-cases/user/GoogleLoginUserUseCase";
// import { ForgotPasswordUseCase } from "../../application/use-cases/user/ForgotUserPasswordUseCase";
// import { ResetPasswordUseCase } from "../../application/use-cases/user/ResetUserPasswordUseCase";
// import { VerifyOtpUseCase } from "../../application/use-cases/user/VerifyOtpUseCase";

// //admin
// import { LoginAdminUseCase } from "../../application/use-cases/admin/LoginAdminUseCase";
// import { GetUsersUseCase } from "../../application/use-cases/admin/GetUsersUseCase";

// import { ILoginUserUseCase } from "../../application/ports/user/ILoginUserUseCase";
// import { IRegisterUserUseCase } from "../../application/ports/user/IRegisterUserUseCase";


// //usecases will injected by auto via @inject
// //user
// // container.registerSingleton(RegisterUserUseCase)

// container.registerSingleton<ILoginUserUseCase>("LoginUserUseCase",LoginUserUseCase)
// container.registerSingleton<IRegisterUserUseCase>("RegisterUserUseCase",RegisterUserUseCase)

// container.registerSingleton(VerifyUserUseCase)
// container.registerSingleton(GoogleLoginUserUseCase)
// container.registerSingleton(ForgotPasswordUseCase)
// container.registerSingleton(ResetPasswordUseCase)
// container.registerSingleton(VerifyOtpUseCase);

// //admin
// container.registerSingleton(LoginAdminUseCase)
// container.registerSingleton(GetUsersUseCase)


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


//usecases will injected by auto via @inject
//user

container.registerSingleton<ILoginUserUseCase>("LoginUserUseCase",LoginUserUseCase)
container.registerSingleton<IRegisterUserUseCase>("RegisterUserUseCase",RegisterUserUseCase)
container.registerSingleton<IVerifyUserUseCase>("VerifyUserUseCase",VerifyUserUseCase);
container.registerSingleton<IGoogleLoginUserUseCase>("GoogleLoginUserUseCase",GoogleLoginUserUseCase)
container.registerSingleton<IForgotPasswordUseCase>("ForgotPasswordUseCase",ForgotPasswordUseCase)
container.registerSingleton<IResetPasswordUseCase>("ResetPasswordUseCase",ResetPasswordUseCase)
container.registerSingleton<IVerifyOtpUseCase>("VerifyOtpUseCase",VerifyOtpUseCase)

//admin
container.registerSingleton<ILoginAdminUseCase>("LoginAdminUseCase",LoginAdminUseCase)
container.registerSingleton<IGetUsersUseCase>("GetUsersUseCase",GetUsersUseCase)

//worker
container.registerSingleton<IWorkerLoginUseCase>("WorkerLoginUseCase",WorkerLoginUseCase)