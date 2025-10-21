
import { container } from "tsyringe";

import { HashService } from "../services/HashServices";

import { IHashService } from "../../domain/services/IHashService";

container.registerSingleton<IHashService>("HashService",HashService)