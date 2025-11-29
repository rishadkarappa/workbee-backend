import { container } from "tsyringe";

// worker usecases
import { ApplyWorkerUseCase } from "../../application/use-case/ApplyWorkerUseCase";
import { GetAllWorkersUseCase } from "../../application/use-case/GetAllWorkersUseCase";
import { GetNewAppliersUseCase } from "../../application/use-case/GetNewAppliersUseCase";
import { WorkerApproveUseCase } from "../../application/use-case/WorkerApproveUseCase";

// work usecases
import { PostWorkUseCase } from "../../application/use-case/PostWorkUseCase";
import { GetAllWorksUseCase } from "../../application/use-case/GetAllWorksUseCase";

// usecase interfaces
import { IApplyWorkerUseCase } from "../../application/ports/worker/IApplyWorkerUseCase";
import { IGetAllWorkersUseCase } from "../../application/ports/worker/IGetAllWorkersUseCase";
import { IGetNewAppliersUseCase } from "../../application/ports/worker/IGetNewAppliersUseCase";
import { IWorkerApproveUseCase } from "../../application/ports/worker/IWorkerApproveUseCase";
import { IPostWorkUseCase } from "../../application/ports/work/IPostWorkUseCase";
import { IGetAllWorksUseCase } from "../../application/ports/work/IGetAllWorksUseCase";
import { GetWorkersCountUseCase } from "../../application/use-case/GetWorkersCountUseCase";

// register worker usecase
container.registerSingleton<IApplyWorkerUseCase>("ApplyWorkerUseCase", ApplyWorkerUseCase);
container.registerSingleton<IGetAllWorkersUseCase>("GetAllWorkersUseCase", GetAllWorkersUseCase);
container.registerSingleton<IGetNewAppliersUseCase>("GetNewAppliersUseCase", GetNewAppliersUseCase);
container.registerSingleton<IWorkerApproveUseCase>("WorkerApproveUseCase", WorkerApproveUseCase);
container.registerSingleton("GetWorkersCountUseCase",GetWorkersCountUseCase)

// register work usecase
container.registerSingleton<IPostWorkUseCase>("PostWorkUseCase", PostWorkUseCase);
container.registerSingleton<IGetAllWorksUseCase>("GetAllWorksUseCase", GetAllWorksUseCase);

