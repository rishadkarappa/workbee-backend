import { container } from "tsyringe";
import { ApplyWorkerUseCase } from "../../use-case/ApplyWorkerUseCase";
import { PostWorkUseCase } from "../../use-case/PostWorkUseCase";

container.registerSingleton(ApplyWorkerUseCase)
container.registerSingleton(PostWorkUseCase) 