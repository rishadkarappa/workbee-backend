import { inject, injectable } from "tsyringe";
import { IWorkRepository } from "../domain/repositories/IWorkRepository";
import { IUserGrpcService } from "../domain/services/IUserGrpcService";
import { Work } from "../domain/entities/Work";



@injectable()
export class PostWorkUseCase{
    constructor(
        @inject("WorkRepository") private workRepository:IWorkRepository,
        @inject("UserGrpcService") private userGrpcService:IUserGrpcService,
        // @inject("")
    ){}

    async execute(workData:Omit<Work, 'id'|'createdAt'|'updatedAt'>):Promise<Work>{
        const userValidation = await this.userGrpcService.validateUser(workData.userId)
        if(!userValidation.success||!userValidation.isValid){
            throw new Error('invalid  user please login first')
        }
        if(!workData.workTitle||!workData.workCategory||!workData.contactNumber||!workData.description){
            throw new Error("fill required feilds firist title ,dispcription ,contact number")
        }
        const workToCreate:Work = {
            ...workData,
            status:"pending"
        };
        const createdWork = await this.workRepository.create(workToCreate)
        return createdWork
    }
}