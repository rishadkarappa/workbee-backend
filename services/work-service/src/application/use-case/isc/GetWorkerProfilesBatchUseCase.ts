import { inject, injectable } from 'tsyringe';
import { IWorkerRepository } from '../../../domain/repositories/IWorkerRepository';
import { IGetWorkerProfileBatchUseCase } from '../../ports/isc/IGetWorkerProfilesBatchUseCase';
import { GetWorkerProfilesBatchDto, GetWorkerProfilesBatchResponseDto } from '../../dtos/worker/GetWorkerProfilesBatch.dtos';

@injectable()
export class GetWorkerProfilesBatchUseCase implements IGetWorkerProfileBatchUseCase{
  constructor(
    @inject("WorkerRepository") private workerRepository: IWorkerRepository
  ) { }

  async execute(dto:GetWorkerProfilesBatchDto) : Promise<GetWorkerProfilesBatchResponseDto>{
    
    const {workerIds} = dto

    if ( workerIds.length === 0) {
      return [];
    }

    const workers = await this.workerRepository.findByIds(workerIds);

    return workers.map(worker => ({
      id: worker.id,
      name: worker.name,
      email: worker.email,
      role: 'worker',
    }));

  }
}
