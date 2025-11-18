import { WorkerApproveDto, WorkerResponseDto } from "../../dtos/WorkerDTO";

export interface IWorkerApproveUseCase {
    execute(dto: WorkerApproveDto): Promise<WorkerResponseDto>;
}