import { injectable } from "tsyringe";
import { MongoBaseRepository } from "./MongoBaseRepository";
import { Worker } from "../../../domain/entities/Worker";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { WorkerModel } from "../models/WorkerSchema";


@injectable()
export class MongoWorkerRepository extends MongoBaseRepository<Worker, any> implements IWorkerRepository {
    constructor(){
        super(WorkerModel)
    }

    protected map(worker: any): Worker {
        return {
            id:worker.id,
            name:worker.name,
            email:worker.email,
            phone:worker.phone,
            password:worker.password,
            location:worker.location,
            workType:worker.workType,
            preferredWorks:worker.preferredWorks,
            confirmations:worker.confirmations,
            isApproved:worker.isApproved,
            createdAt:worker.createdAt,
            updatedAt:worker.updatedAt
        }
    }

    async save(worker: Worker): Promise<Worker> {
        if(worker.id) {
            const updated = await WorkerModel.findByIdAndUpdate(worker.id, worker, {new:true})
            return this.map(updated!)
        } else {
            const newWorker = new WorkerModel(worker)
            const saved = await newWorker.save()
            return this.map(saved) 
        }
    }

    async findByEmail(email: string): Promise<Worker | null> {
        const worker = await WorkerModel.findOne({email})
        return worker ? this.map(worker) : null
    }

    async getNewAppliers(): Promise<Worker[]> {
        const newAppliers = await this.findAll()
        return newAppliers
    }
}