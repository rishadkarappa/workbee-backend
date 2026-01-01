import { container } from "tsyringe";
import { CacheService } from "../services/CacheService";

container.registerSingleton("CacheService", CacheService);
