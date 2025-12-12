import { inject, injectable } from "tsyringe";
import { IDeleteMyWorkUseCase } from "../ports/user/IDeleteMyWorkUseCase";
import { IWorkRepository } from "../../domain/repositories/IWorkRepository";
import { DeleteWorkDto } from "../dtos/WorkDTO";

@injectable()
export class DeleteMyWorkUseCase implements IDeleteMyWorkUseCase {
    constructor(
        @inject("WorkRepository") private workRepository: IWorkRepository
    ) { }

    async execute(dto: DeleteWorkDto): Promise<boolean> {
        const work = await this.workRepository.findById(dto.workId);

        if (!work) {
            throw new Error("Work not found");
        }

        if (work.userId !== dto.userId) {
            throw new Error("Unauthorized to delete this work");
        }

        const deleted = await this.workRepository.delete(dto.workId);

        if (!deleted) {
            throw new Error("Delete failed");
        }

        return true;
    }

}
