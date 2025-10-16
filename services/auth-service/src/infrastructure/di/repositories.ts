import { container } from "tsyringe";

import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";

import { MongoOtpRepository } from "../database/repositories/MongoOtpRepository";
import { MongoUserRepository } from "../database/repositories/MongoUserRepository";

//bind repositories
container.register<IUserRepository>("UserRepository",{useClass:MongoUserRepository})
container.register<IOtpRepository>("OtpRepository",{useClass:MongoOtpRepository})

