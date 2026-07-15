import { GetWorkerAssignedWorksDto } from "../../dtos/worker/GetWorkerAssignedWorks.Dtos";

export interface IGetWorkerAssignedWorksUseCase {
    execute (dto:GetWorkerAssignedWorksDto): Promise<any>;
}