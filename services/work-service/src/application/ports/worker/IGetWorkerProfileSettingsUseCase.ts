import {GetWorkerProfileSettingsDto,WorkerProfileSettingsResponseDto,} from "../../dtos/worker/WorkerProfileDTO";

export interface IGetWorkerProfileSettingsUseCase {
    execute(dto: GetWorkerProfileSettingsDto): Promise<WorkerProfileSettingsResponseDto>;
}