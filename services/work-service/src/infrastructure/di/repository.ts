import { container } from "tsyringe";
import { MongoWorkerRepository } from "../database/repositories/MongoWorkerRepository";
import { MongoWorkRepository } from "../database/repositories/MongoWorkRepository";


container.register("WorkerRepository", { useClass : MongoWorkerRepository})
container.register("WorkRepository",{useClass:MongoWorkRepository})