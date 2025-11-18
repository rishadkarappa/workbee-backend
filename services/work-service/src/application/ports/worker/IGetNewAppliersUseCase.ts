import { WorkerResponseDto } from "../../dtos/WorkerDTO";

export interface IGetNewAppliersUseCase {
    execute(): Promise<WorkerResponseDto[]>;
}
