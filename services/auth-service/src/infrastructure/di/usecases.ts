
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


//usecases will injected by auto via @inject
//user
container.registerSingleton(RegisterUserUseCase)
container.registerSingleton(LoginUserUseCase)
container.registerSingleton(VerifyUserUseCase)
container.registerSingleton(GoogleLoginUserUseCase)
container.registerSingleton(ForgotPasswordUseCase)
container.registerSingleton(ResetPasswordUseCase)
container.registerSingleton(VerifyOtpUseCase);

//admin
container.registerSingleton(LoginAdminUseCase)
container.registerSingleton(GetUsersUseCase)
