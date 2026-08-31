// import { inject, injectable } from "tsyringe";
// import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";


// @injectable()
// class ReApplyAsAWorkerUseCase {
//     constructor(
//         @inject("WorkerRepository") private readonly _WorkerRepository:IWorkerRepository;
//     ){}

//     async execute(userId:string, rejData:string):Promise<void> {

//         const rejectedData = this._WorkerRepository.findByIdAndUpdateRejectedReason(userId, rejData)

//         if (!rejectedData) {
//             throw new Error("worker not found in db")
//         }
//         return true
//     }
// }