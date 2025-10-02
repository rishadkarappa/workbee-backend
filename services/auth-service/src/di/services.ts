import { container } from "tsyringe";

import { HashService } from "../infrastructure/services/HashService";
import { TokenService } from "../infrastructure/services/TokenService";
import { EmailService } from "../infrastructure/services/EmailService";
import { OtpService } from "../infrastructure/services/OtpService";


//bind sevices as singletons
container.registerSingleton(HashService)
container.registerSingleton(TokenService)
container.registerSingleton(EmailService)
container.registerSingleton(OtpService)
