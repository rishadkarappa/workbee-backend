import { container } from "tsyringe";

import { HashService } from "../services/HashService";
import { TokenService } from "../services/TokenService";
import { EmailService } from "../services/EmailService";
import { OtpService } from "../services/OtpService";

//service repos
import { ITokenService } from "../../domain/services/ITokenService";

//bind sevices as singletons
container.registerSingleton(HashService)
container.registerSingleton(TokenService)
container.registerSingleton(EmailService)
container.registerSingleton(OtpService)

container.register<ITokenService>("ITokenService",{useClass:TokenService})
