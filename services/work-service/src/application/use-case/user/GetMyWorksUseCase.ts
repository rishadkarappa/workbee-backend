import { inject, injectable } from "tsyringe";
import { IGetMyWorksUseCase } from "../../ports/user/IGetMyWorksUseCase";
import { IWorkRepository } from "../../../domain/repositories/IWorkRepository";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

@injectable()
export class GetMyWorksUseCase implements IGetMyWorksUseCase {
    constructor(
        @inject("WorkRepository") private readonly _workRepository: IWorkRepository
    ) {}

    async execute(userId: string) {
        const result = await this._workRepository.getMyWorks(userId);
        
        if (!result.works || result.works.length === 0) {
            throw new Error(ErrorMessages.WORK.WORK_NOT_FOUND);
        }
        
        return result;
    }
}