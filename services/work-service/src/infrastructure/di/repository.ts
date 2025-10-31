import { container } from "tsyringe";
import { MongoWorkerRepository } from "../database/repositories/MongoWorkerRepository";


container.register("WorkerRepository", { useClass : MongoWorkerRepository})
container.register("WorkRepository",{useClass:MongoWorkerRepository})