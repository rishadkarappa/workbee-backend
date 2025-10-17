import { container } from "tsyringe";

import { HashService } from "../services/HashService";
import { TokenService } from "../services/TokenService";
import { EmailService } from "../services/EmailService";
import { OtpService } from "../services/OtpService";

//service interfaces
import { ITokenService } from "../../domain/services/ITokenService";
import { IHashService } from "../../domain/services/IHashService";
import { IEmailService } from "../../domain/services/IEmailService";
import { IOtpService } from "../../domain/services/IOtpService";

//bind sevices as singletons
container.registerSingleton<IHashService>("HashService", HashService);
container.registerSingleton<ITokenService>("TokenService", TokenService);
container.registerSingleton<IEmailService>("EmailService", EmailService);
container.registerSingleton<IOtpService>("OtpService", OtpService);
