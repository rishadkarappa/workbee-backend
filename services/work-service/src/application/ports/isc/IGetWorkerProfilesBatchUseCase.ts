import { GetWorkerProfilesBatchDto, GetWorkerProfilesBatchResponseDto } from '../../dtos/worker/GetWorkerProfilesBatchDtos'

export interface IGetWorkerProfileBatchUseCase {
    execute(dto:GetWorkerProfilesBatchDto) : Promise<GetWorkerProfilesBatchResponseDto>
}

