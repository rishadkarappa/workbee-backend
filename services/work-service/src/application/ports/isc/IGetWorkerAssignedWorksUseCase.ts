import { GetWorkerAssignedWorksDto, GetWorkerAssignedWorksResponseDto } from "../../dtos/worker/GetWorkerAssignedWorks.dtos";

export interface IGetWorkerAssignedWorksUseCase {
    execute (dto:GetWorkerAssignedWorksDto): Promise<GetWorkerAssignedWorksResponseDto[]>;
}
