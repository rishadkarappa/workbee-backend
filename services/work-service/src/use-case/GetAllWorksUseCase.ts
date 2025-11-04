import { inject, injectable } from "tsyringe";

import { IWorkRepository } from "../domain/repositories/IWorkRepository";
import { Work } from "../domain/entities/Work";


@injectable()
export class GetAllWorksUseCase{
    constructor(
        @inject("WorkRepository") private workRepository:IWorkRepository
    ){}

    async execute():Promise<Work []>{
        const works = await this.workRepository.findAll()
        if(!works) throw new Error("did't get works in backend usecase")
        return works
    }

}