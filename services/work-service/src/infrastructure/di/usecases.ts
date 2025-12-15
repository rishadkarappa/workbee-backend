import { container } from "tsyringe";

// worker usecases
import { ApplyWorkerUseCase } from "../../application/use-case/worker/ApplyWorkerUseCase";
import { GetAllWorkersUseCase } from "../../application/use-case/admin/GetAllWorkersUseCase";
import { GetNewAppliersUseCase } from "../../application/use-case/admin/GetNewAppliersUseCase";
import { WorkerApproveUseCase } from "../../application/use-case/admin/WorkerApproveUseCase";

// work usecases
import { PostWorkUseCase } from "../../application/use-case/work/PostWorkUseCase";
import { GetAllWorksUseCase } from "../../application/use-case/admin/GetAllWorksUseCase";

// usecase interfaces
import { IApplyWorkerUseCase } from "../../application/ports/worker/IApplyWorkerUseCase";
import { IGetAllWorkersUseCase } from "../../application/ports/worker/IGetAllWorkersUseCase";
import { IGetNewAppliersUseCase } from "../../application/ports/worker/IGetNewAppliersUseCase";
import { IWorkerApproveUseCase } from "../../application/ports/worker/IWorkerApproveUseCase";
import { IPostWorkUseCase } from "../../application/ports/work/IPostWorkUseCase";
import { IGetAllWorksUseCase } from "../../application/ports/work/IGetAllWorksUseCase";
import { IBlockWorkerUseCase } from "../../application/ports/worker/IBlockWorkerUseCase";
import { BlockWorkerUseCase } from "../../application/use-case/worker/BlockWorkerUseCase";
import { IGetMyWorksUseCase } from "../../application/ports/user/IGetMyWorksUseCase";
import { GetMyWorksUseCase } from "../../application/use-case/user/GetMyWorksUseCase";
import { IUpdateWorkUseCase } from "../../application/ports/user/IUpdateWorkUseCase";
import { UpdateWorkUseCase } from "../../application/use-case/user/UpdateWorkUseCase";
import { IDeleteMyWorkUseCase } from "../../application/ports/user/IDeleteMyWorkUseCase";
import { DeleteMyWorkUseCase } from "../../application/use-case/user/DeleteMyWorkUseCase"

// register worker usecase
container.registerSingleton<IApplyWorkerUseCase>("ApplyWorkerUseCase", ApplyWorkerUseCase);
container.registerSingleton<IGetAllWorkersUseCase>("GetAllWorkersUseCase", GetAllWorkersUseCase);
container.registerSingleton<IGetNewAppliersUseCase>("GetNewAppliersUseCase", GetNewAppliersUseCase);
container.registerSingleton<IWorkerApproveUseCase>("WorkerApproveUseCase", WorkerApproveUseCase);
container.registerSingleton<IBlockWorkerUseCase>("BlockWorkerUseCase", BlockWorkerUseCase);

// register work usecase
container.registerSingleton<IPostWorkUseCase>("PostWorkUseCase", PostWorkUseCase);
container.registerSingleton<IGetAllWorksUseCase>("GetAllWorksUseCase", GetAllWorksUseCase);
container.registerSingleton<IGetMyWorksUseCase>("GetMyWorksUseCase", GetMyWorksUseCase);
container.registerSingleton<IUpdateWorkUseCase>("UpdateWorkUseCase", UpdateWorkUseCase);
container.registerSingleton<IDeleteMyWorkUseCase>("DeleteMyWorkUseCase", DeleteMyWorkUseCase);

