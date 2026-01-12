import { inject, injectable } from 'tsyringe';
import { IWorkerRepository } from '../../../domain/repositories/IWorkerRepository';

@injectable()
export class GetWorkerProfilesBatchUseCase {
  constructor(
    @inject("WorkerRepository") private workerRepository: IWorkerRepository
  ) {}

  async execute(workerIds: string[]) {
    if (!workerIds || workerIds.length === 0) {
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
