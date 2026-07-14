import { GetWorkerProfileDto, GetWorkerProfileReponseDto } from "../../dtos/worker/WorkerDTO";

export interface IGetWorkerProfileUseCase {
    execute(dto:GetWorkerProfileDto) : Promise<GetWorkerProfileReponseDto>;
}