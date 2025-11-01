import { inject, injectable } from "tsyringe";
import { IWorkRepository } from "../domain/repositories/IWorkRepository";
import { IUserGrpcService } from "../domain/services/IUserGrpcService";
import { Work } from "../domain/entities/Work";

@injectable()
export class PostWorkUseCase{
    constructor(
        @inject("WorkRepository") private workRepository:IWorkRepository,
        @inject("UserGrpcService") private userGrpcService:IUserGrpcService,
    ){}

    async execute(workData:Omit<Work, 'id'|'createdAt'|'updatedAt'>):Promise<Work>{
        try {
            const userValidation = await this.userGrpcService.validateUser(workData.userId);
            
            if(!userValidation.success || !userValidation.isValid){
                throw new Error('Invalid user, please login first')
            }
        } catch (error: any) {
            console.error("User validation error:", error);
            throw new Error(`User validation failed: ${error.message}`)
        }
        
        console.log("User validated successfully");
        
        if(!workData.workTitle || !workData.workCategory || !workData.contactNumber || !workData.description){
            throw new Error("Please fill required fields: title, description, contact number, category")
        }
        
        if(!workData.workType){
            throw new Error("Work type is required (oneDay or multipleDay)")
        }
        
        if(workData.workType === 'oneDay' && !workData.date){
            throw new Error("Date is required for one day work")
        }
        if(workData.workType === 'multipleDay' && (!workData.startDate || !workData.endDate)){
            throw new Error("Start date and end date are required for multiple day work")
        }
        if(!workData.time){
            throw new Error("Time is required")
        }
        
        console.log("All validations passed, creating work...");
        
        const workToCreate:Work = {
            ...workData,
            status:"pending"
        };
        
        console.log("Work to create:", workToCreate);
        
        const createdWork = await this.workRepository.create(workToCreate);
        
        console.log("Work created successfully:", createdWork);
        
        return createdWork;
    }
}