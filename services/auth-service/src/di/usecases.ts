
import { container } from "tsyringe";

import { RegisterUserUseCase } from "../application/use-cases/user/RegisterUserUseCase";
import { LoginUserUseCase } from "../application/use-cases/user/LoginUserUseCase";
import { VerifyUserUseCase } from "../application/use-cases/user/VerifyUserUseCase";
import { GoogleLoginUserUseCase } from "../application/use-cases/user/GoogleLoginUserUseCase";

import { LoginAdminUseCase } from "../application/use-cases/admin/LoginAdminUseCase";

//usecases will injected by auto via @inject
//user
container.registerSingleton(RegisterUserUseCase)
container.registerSingleton(LoginUserUseCase)
container.registerSingleton(VerifyUserUseCase)
container.registerSingleton(GoogleLoginUserUseCase)

//admin
container.registerSingleton(LoginAdminUseCase)