import { inject, injectable } from 'tsyringe';
import { IWorkerRepository } from '../../../domain/repositories/IWorkerRepository';
import { GetWorkerProfileDto, GetWorkerProfileReponseDto } from '../../dtos/worker/WorkerDTO';
import { IGetWorkerProfileUseCase } from '../../ports/worker/IGetWorkerProfileUseCase';

@injectable()
export class GetWorkerProfileUseCase implements IGetWorkerProfileUseCase{
  constructor(
    @inject("WorkerRepository") private workerRepository: IWorkerRepository
  ) { }

  async execute(dto:GetWorkerProfileDto) : Promise<GetWorkerProfileReponseDto> {
    const worker = await this.workerRepository.findById(dto.workerId);

    if (!worker) {
      throw new Error('Worker not found');
    }

    return {
      id: worker.id,
      name: worker.name,
      email: worker.email,
      role: 'worker',
      createdAt: worker.createdAt
    };

  }
}
