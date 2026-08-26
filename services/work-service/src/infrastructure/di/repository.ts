import { container } from "tsyringe";
import { MongoWorkerRepository } from "../database/repositories/MongoWorkerRepository";
import { MongoWorkRepository } from "../database/repositories/MongoWorkRepository";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { IWorkRepository } from "../../domain/repositories/IWorkRepository";
import { IReviewRepository } from "../../domain/repositories/IReviewRepository";
import { MongoReviewRepository } from "../database/repositories/MongoReviewRepository";

container.register<IWorkerRepository>("WorkerRepository", { useClass: MongoWorkerRepository })
container.register<IWorkRepository>("WorkRepository", { useClass: MongoWorkRepository })
container.registerSingleton<IReviewRepository>("ReviewRepository", MongoReviewRepository);
