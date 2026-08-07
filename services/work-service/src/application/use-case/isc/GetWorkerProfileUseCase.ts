import { inject, injectable } from 'tsyringe';
import { IWorkerRepository } from '../../../domain/repositories/IWorkerRepository';
import { GetWorkerProfileDto, GetWorkerProfileReponseDto } from '../../dtos/worker/WorkerDTO';
import { IGetWorkerProfileUseCase } from '../../ports/worker/IGetWorkerProfileUseCase';
import { UserRole } from 'workbee-common';
import { ErrorMessages } from '../../../shared/constants/ErrorMessages';

@injectable()
export class GetWorkerProfileUseCase implements IGetWorkerProfileUseCase{
  constructor(
    @inject("WorkerRepository") private readonly _workerRepository: IWorkerRepository
  ) { }

  async execute(dto:GetWorkerProfileDto) : Promise<GetWorkerProfileReponseDto> {
    const worker = await this._workerRepository.findById(dto.workerId);

    if (!worker) {
      throw new Error(ErrorMessages.WORKER.WORKER_NOT_FOUND);
    }

    return {
      id: worker.id,
      name: worker.name,
      email: worker.email,
      role: UserRole.WORKER,
      createdAt: worker.createdAt
    };

  }
}
