import { inject, injectable } from 'tsyringe';
import { IWorkerRepository } from '../../../domain/repositories/IWorkerRepository';

@injectable()
export class GetWorkerProfileUseCase {
  constructor(
    @inject("WorkerRepository") private workerRepository: IWorkerRepository
  ) {}

  async execute(workerId: string) {
    const worker = await this.workerRepository.findById(workerId);
    
    if (!worker) {
      throw new Error('Worker not found');
    }

    // return {
    //   id: worker.id || worker._id,
    //   name: worker.name,
    //   email: worker.email,
    //   role: 'worker',
    //   skills: worker.skills,
    //   phone: worker.phone,
    //   rating: worker.rating,
    //   createdAt: worker.createdAt
    // };
  }
}
