import { container } from "tsyringe";
import { CacheService } from "../services/CacheService";
import { HttpClientService } from "../http/HttpClientService";

container.registerSingleton("CacheService", CacheService);
container.registerSingleton("HttpClientService", HttpClientService);
