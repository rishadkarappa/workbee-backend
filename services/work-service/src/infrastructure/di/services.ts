
import { container } from "tsyringe";

import { HashService } from "../services/HashServices";

import { IHashService } from "../../domain/services/IHashService";
import { UserGrpcService } from "../services/grpc/UserGrpcService";

container.registerSingleton<IHashService>("HashService",HashService)

//grpc
container.register("UserGrpcService",{useClass:UserGrpcService})
