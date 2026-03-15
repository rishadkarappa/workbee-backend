import { container } from "tsyringe";
import { CacheService } from "../services/CacheService";
import { HttpClientService } from "../http/HttpClientService";
import { CloudinaryService } from "../services/CloudinaryService";

container.registerSingleton("CacheService", CacheService);
container.registerSingleton("HttpClientService", HttpClientService);
container.registerSingleton('CloudinaryService', CloudinaryService);