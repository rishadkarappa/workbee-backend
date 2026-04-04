
import { inject, injectable } from "tsyringe";
import { IWorkRepository } from "../../../domain/repositories/IWorkRepository";
 
@injectable()
export class GetWorkerAssignedWorksUseCase {
    constructor(
        @inject("WorkRepository") private _workRepository: IWorkRepository
    ) {}
 
    async execute(workerId: string) {
        const result = await this._workRepository.findByWorkerId(workerId);
        return result;
    }
}