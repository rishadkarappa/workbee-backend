
import { container } from "tsyringe";

import { RegisterUserUseCase } from "../application/use-cases/user/RegisterUserUseCase";
import { LoginUserUseCase } from "../application/use-cases/user/LoginUserUseCase";
import { VerifyUserUseCase } from "../application/use-cases/user/VerifyUserUseCase";

//usecases will injected by auto via @inject
container.registerSingleton(RegisterUserUseCase)
container.registerSingleton(LoginUserUseCase)
container.registerSingleton(VerifyUserUseCase)