import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../../../../domain/repositories/IWorkerRepository";
import { ErrorMessages } from "../../../../shared/constants/ErrorMessages";

@injectable()
export class UpdateWorkerProfileImageUseCase {

    constructor(
        @inject("WorkerRepository") private readonly _workerRepository: IWorkerRepository
    ) { }

    async execute(dto: { workerId: string; imageUrl: string; publicId: string; }) {

        const worker =
            await this._workerRepository.findById(dto.workerId);

        if (!worker) {
            throw new Error(ErrorMessages.WORKER.WORKER_NOT_FOUND);
        }

        const updated = await this._workerRepository.updateProfileImage(dto.workerId, dto.imageUrl, dto.publicId);

        if (!updated) {
            throw new Error(ErrorMessages.WORKER.FAILED_TO_UPDATE_PROFILE_IMAGE);
        }

        return { isUpdated: true };
    }
}