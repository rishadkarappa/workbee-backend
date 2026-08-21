import { inject, injectable } from "tsyringe";
import { addWorkerReviewReqDto } from "../../dtos/worker/AddWorkerReviewClientReqDTO";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";
import { IAddWorkerReviewUseCase } from "../../ports/worker/IAddWorkerReviewUseCase";


@injectable()
export class AddWorkerReviewUseCase implements IAddWorkerReviewUseCase {
    constructor(
        @inject("WorkerRepository") private readonly _workerRepository:IWorkerRepository
    ){}
    async execute(dto:addWorkerReviewReqDto):Promise<boolean> {

        const worker = await this._workerRepository.findById(dto.workId)

        if (!worker) throw new Error(ErrorMessages.WORKER.WORKER_NOT_FOUND)

        const AddReview = await this._workerRepository.addReviewField(dto.workId)

        return AddReview
    }
}