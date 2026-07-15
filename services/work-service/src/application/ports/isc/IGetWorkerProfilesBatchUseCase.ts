import { GetWorkerProfilesBatchDto, GetWorkerProfilesBatchResponseDto } from '../../dtos/worker/GetWorkerProfilesBatch.dtos'

export interface IGetWorkerProfileBatchUseCase {
    execute(dto:GetWorkerProfilesBatchDto) : Promise<GetWorkerProfilesBatchResponseDto>
}

