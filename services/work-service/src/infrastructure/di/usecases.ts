import { container } from "tsyringe";
import { ApplyWorkerUseCase } from "../../use-case/ApplyWorkerUseCase";

container.registerSingleton(ApplyWorkerUseCase)