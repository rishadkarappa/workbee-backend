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
import { GetWorkerProfileUseCase } from "../../application/use-case/isc/GetWorkerProfileUseCase";
import { GetWorkerProfilesBatchUseCase } from "../../application/use-case/isc/GetWorkerProfilesBatchUseCase";
import { GetWorkerAssignedWorksUseCase } from "../../application/use-case/worker/GetWorkerAssignedWorksUseCase";
import { GetWorkerProfileSettingsUseCase } from "../../application/use-case/worker/profile-settings/GetWorkerProfileUseCase";
import { UpdateWorkerProfileImageUseCase } from "../../application/use-case/worker/profile-settings/UpdateWorkerProfileImageUseCase";
import { CreateReviewUseCase } from "../../application/use-case/review/CreateReviewUseCase";
import { CheckReviewExistsUseCase } from "../../application/use-case/review/CheckReviewExistsUseCase";
import { GetWorkerProfileStatsUseCase } from "../../application/use-case/review/GetWorkerProfileStatsUseCase";
import { ICreateReviewUseCase } from "../../application/ports/review/ICreateReviewUseCase";
import { ICheckReviewExistsUseCase } from "../../application/ports/review/ICheckReviewExistsUseCase";
import { IGetWorkerProfileStatsUseCase } from "../../application/ports/review/IGetWorkerProfileStatsUseCase";
import { IGetWorkerProfileUseCase } from "../../application/ports/worker/IGetWorkerProfileUseCase";
import { IGetWorkerProfileBatchUseCase } from "../../application/ports/isc/IGetWorkerProfilesBatchUseCase";
import { GetWorkerDashboardStatsUseCase } from "../../application/use-case/worker/GetWorkerDashboardStatsUseCase";
import { IGetWorkerDashboardStatsUseCase } from "../../application/ports/worker/IGetWorkerDashboardStatsUseCase";
import { IGetWorkerAssignedWorksUseCase } from "../../application/ports/isc/IGetWorkerAssignedWorksUseCase";
import { IGetAdminWorkStatsUseCase } from "../../application/ports/admin/IGetAdminWorkStatsUseCase";
import { GetAdminWorkStatsUseCase } from "../../application/use-case/admin/GetAdminWorkStatsUseCase";
import { UpdateWorkerProfileUseCase } from "../../application/use-case/worker/profile-settings/UpdateWorkerProfileUseCase";
import { IUpdateWorkerProfileUseCase } from "../../application/ports/worker/IUpdateWorkerProfileUseCase";
import { IUpdateWorkerProfileImageUseCase } from "../../application/ports/worker/IUpdateWorkerProfileImageUseCase";
import { IGetWorkerProfileSettingsUseCase } from "../../application/ports/worker/IGetWorkerProfileSettingsUseCase";

// register worker usecase
container.registerSingleton<IApplyWorkerUseCase>("ApplyWorkerUseCase", ApplyWorkerUseCase);
container.registerSingleton<IGetAllWorkersUseCase>("GetAllWorkersUseCase", GetAllWorkersUseCase);
container.registerSingleton<IGetNewAppliersUseCase>("GetNewAppliersUseCase", GetNewAppliersUseCase);
container.registerSingleton<IWorkerApproveUseCase>("WorkerApproveUseCase", WorkerApproveUseCase);
container.registerSingleton<IBlockWorkerUseCase>("BlockWorkerUseCase", BlockWorkerUseCase);

container.registerSingleton<IGetWorkerProfileUseCase>("GetWorkerProfileUseCase", GetWorkerProfileUseCase);
container.registerSingleton<IGetWorkerProfileBatchUseCase>("GetWorkerProfilesBatchUseCase", GetWorkerProfilesBatchUseCase);

// register work usecase
container.registerSingleton<IPostWorkUseCase>("PostWorkUseCase", PostWorkUseCase);
container.registerSingleton<IGetAllWorksUseCase>("GetAllWorksUseCase", GetAllWorksUseCase);
container.registerSingleton<IGetMyWorksUseCase>("GetMyWorksUseCase", GetMyWorksUseCase);
container.registerSingleton<IUpdateWorkUseCase>("UpdateWorkUseCase", UpdateWorkUseCase);
container.registerSingleton<IDeleteMyWorkUseCase>("DeleteMyWorkUseCase", DeleteMyWorkUseCase);

// profile settings
container.registerSingleton<IGetWorkerProfileSettingsUseCase>("GetWorkerProfileSettingsUseCase", GetWorkerProfileSettingsUseCase);
container.registerSingleton<IUpdateWorkerProfileImageUseCase>("UpdateWorkerProfileImageUseCase", UpdateWorkerProfileImageUseCase);
container.registerSingleton<IUpdateWorkerProfileUseCase>("UpdateWorkerProfileUseCase", UpdateWorkerProfileUseCase);

//review
container.register<ICreateReviewUseCase>("CreateReviewUseCase",  CreateReviewUseCase);
container.register<ICheckReviewExistsUseCase>("CheckReviewExistsUseCase",  CheckReviewExistsUseCase);
container.register<IGetWorkerProfileStatsUseCase>("GetWorkerProfileStatsUseCase",  GetWorkerProfileStatsUseCase);

container.registerSingleton<IGetWorkerAssignedWorksUseCase>("GetWorkerAssignedWorksUseCase", GetWorkerAssignedWorksUseCase);
container.register<IGetWorkerDashboardStatsUseCase>("GetWorkerDashboardStatsUseCase", GetWorkerDashboardStatsUseCase);
container.register<IGetAdminWorkStatsUseCase>("GetAdminWorkStatsUseCase", GetAdminWorkStatsUseCase);