// import { inject, injectable } from "tsyringe";
// import { IWorkerRepository } from "../domain/repositories/IWorkerRepository";
// import { IHashService } from "../domain/services/IHashService";

// /**
//  *  This use case is for inter-service communication via gRPC
//  *  Auth service calls this through gRPC to validate worker credentials
//  *  This ONLY validates credentials and returns worker data
//  *  Token generation happens in auth-service
//  */

// @injectable()
// export class ValidateWorkerCredentialsUseCase{
//     constructor(
//         @inject("WorkerRepository") private workerRepository: IWorkerRepository,
//         @inject("HashService") private hashService: IHashService
//     ) { }

//     async execute(email: string, plainPassword: string) {
//         const worker = await this.workerRepository.findByEmail(email);
//         if (!worker) throw new Error("worker is not exist, please apply for worker");
//         if (!worker?.isApproved) throw new Error("your application under verifying, try after some time");
//         const validPassword = await this.hashService.compare(plainPassword, worker.password)
//         if (!validPassword) throw new Error("invalid password")
//         return worker
//     }
// }