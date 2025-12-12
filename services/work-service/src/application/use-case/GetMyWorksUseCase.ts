import { inject, injectable } from "tsyringe";
import { IGetMyWorksUseCase } from "../ports/user/IGetMyWorksUseCase";
import { IWorkRepository } from "../../domain/repositories/IWorkRepository";

@injectable()
export class GetMyWorksUseCase implements IGetMyWorksUseCase {
    constructor(
        @inject("WorkRepository") private workRepository: IWorkRepository
    ) {}

    async execute(userId: string) {
        const result = await this.workRepository.getMyWorks(userId);
        
        if (!result.works || result.works.length === 0) {
            throw new Error("No works found for this user");
        }
        
        return result;
    }
}