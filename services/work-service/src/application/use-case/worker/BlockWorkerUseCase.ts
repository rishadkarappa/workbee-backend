import { inject, injectable } from "tsyringe";
import { IBlockWorkerUseCase } from "../../ports/worker/IBlockWorkerUseCase";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { WorkerEventPublisher } from "../../../infrastructure/message-bus/WorkerEventPublisher";
import { Worker } from "../../../domain/entities/Worker";

@injectable()
export class BlockWorkerUseCase implements IBlockWorkerUseCase {
  constructor(
    @inject("WorkerRepository") private _workerRepository: IWorkerRepository,
    @inject("WorkerEventPublisher") private _eventPublisher: WorkerEventPublisher
  ) {}

  async execute(workerId: string): Promise<Worker> {
    const worker = await this._workerRepository.findById(workerId);
    if (!worker) throw new Error("Worker not found to block");

    worker.isBlocked = !worker.isBlocked;
    const updatedWorker = await this._workerRepository.save(worker);

    // Publish event → auth service will delete the refresh token
    await this._eventPublisher.publishWorkerBlocked({
      workerId: worker.id!,
      isBlocked: updatedWorker.isBlocked!
    });

    return updatedWorker;
  }
}