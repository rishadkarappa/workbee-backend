import { inject, injectable } from "tsyringe";
import { IDeleteMyWorkUseCase } from "../../ports/user/IDeleteMyWorkUseCase";
import { IWorkRepository } from "../../../domain/repositories/IWorkRepository";
import { DeleteWorkDto } from "../../dtos/work/WorkDTO";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

@injectable()
export class DeleteMyWorkUseCase implements IDeleteMyWorkUseCase {
    constructor(
        @inject("WorkRepository") private readonly _workRepository: IWorkRepository
    ) { }

    async execute(dto: DeleteWorkDto): Promise<boolean> {
        const work = await this._workRepository.findById(dto.workId);

        if (!work) {
            throw new Error(ErrorMessages.WORK.WORK_NOT_FOUND);
        }

        if (work.userId !== dto.userId) {
            throw new Error(ErrorMessages.AUTH.UNAUTHORIZED_TO_DELETE_THIS_WORK);
        }

        const deleted = await this._workRepository.delete(dto.workId);

        if (!deleted) {
            throw new Error(ErrorMessages.WORK.FAILD_TO_DELETE_WORK);
        }
        return true;
    }

}
