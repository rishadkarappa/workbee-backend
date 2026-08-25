import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../../../../domain/repositories/IWorkerRepository";
import { ErrorMessages } from "../../../../shared/constants/ErrorMessages";


@injectable()
export class GetWorkerProfileSettingsUseCase {
    constructor(
        @inject("IWorkerRepository")
        private readonly workerRepository: IWorkerRepository
    ) { }

    async execute(dto: {workerId: string;}) {

        const worker = await this.workerRepository.findById(dto.workerId);

        if (!worker) {
            throw new Error(ErrorMessages.WORKER.WORKER_NOT_FOUND);
        }

        return {
            id: worker.id,
            name: worker.name,
            email: worker.email,
            phone: worker.phone,
            location: worker.location,
            workType: worker.workType,
            preferredWorks: worker.preferredWorks,
            workerProfileImage: worker.workerProfileImage,
            workerProfileImagePublicId: worker.workerProfileImagePublicId,
            createdAt: worker.createdAt,
        };
    }
}