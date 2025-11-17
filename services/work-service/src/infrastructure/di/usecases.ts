import { container } from "tsyringe";
import { ApplyWorkerUseCase } from "../../application/use-case/ApplyWorkerUseCase";
import { PostWorkUseCase } from "../../application/use-case/PostWorkUseCase";

container.registerSingleton(ApplyWorkerUseCase)
container.registerSingleton(PostWorkUseCase) 