import { UpdateWorkerProfileImageDto, UpdateWorkerProfileImageResponseDto, } from "../../dtos/worker/WorkerProfileDTO";

export interface IUpdateWorkerProfileImageUseCase {
    execute(dto: UpdateWorkerProfileImageDto): Promise<UpdateWorkerProfileImageResponseDto>;
}