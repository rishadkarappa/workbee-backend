import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../../../../domain/repositories/IWorkerRepository";
import { ErrorMessages } from "../../../../shared/constants/ErrorMessages";


@injectable()
export class GetWorkerProfileUseCase {
    constructor(
        @inject("IWorkerRepository")
        private readonly workerRepository: IWorkerRepository
    ) { }

    async execute(dto: {userId: string;}) {

        const worker = await this.workerRepository.findById(dto.userId);

        if (!worker) {
            throw new Error(ErrorMessages.WORKER.WORKER_NOT_FOUND);
        }

        return {
            id: worker._id,
            name: worker.name,
            email: worker.email,
            phone: worker.phone,
            location: worker.location,
            workType: worker.workType,
            preferredWorks: worker.preferredWorks,
            profileImage: worker.profileImage,
            profileImagePublicId: worker.profileImagePublicId,
            createdAt: worker.createdAt,
        };
    }
}