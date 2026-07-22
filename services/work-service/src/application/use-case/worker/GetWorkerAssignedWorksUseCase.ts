import { inject, injectable } from "tsyringe";
import { IWorkRepository } from "../../../domain/repositories/IWorkRepository";
import { IGetWorkerAssignedWorksUseCase } from "../../ports/isc/IGetWorkerAssignedWorksUseCase";
import { GetWorkerAssignedWorksDto } from "../../dtos/worker/GetWorkerAssignedWorks.Dtos";
 
@injectable()
export class GetWorkerAssignedWorksUseCase implements IGetWorkerAssignedWorksUseCase {
    constructor(
        @inject("WorkRepository") private readonly _workRepository: IWorkRepository
    ) {}
 
    async execute(dto:GetWorkerAssignedWorksDto) {
        const { workerId } = dto
        const result = await this._workRepository.findByWorkerId(workerId);
        return result;
    }
}