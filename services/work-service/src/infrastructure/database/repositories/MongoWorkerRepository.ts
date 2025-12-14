import { injectable } from "tsyringe";
import { MongoBaseRepository } from "./MongoBaseRepository";
import { Worker } from "../../../domain/entities/Worker";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { WorkerModel } from "../models/WorkerSchema";
import mongoose from "mongoose";

@injectable()
export class MongoWorkerRepository extends MongoBaseRepository<Worker, any> implements IWorkerRepository {
  constructor() {
    super(WorkerModel);
  }

  protected map(worker: any): Worker {
    return {
      id: worker._id?.toString() || worker.id,
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      password: worker.password,
      location: worker.location,
      workType: worker.workType,
      preferredWorks: worker.preferredWorks,
      confirmations: worker.confirmations,
      status: worker.status,
      isBlocked: worker.isBlocked,
      rejectionReason: worker.rejectionReason,
      rejectedAt: worker.rejectedAt,
      canReapply: worker.canReapply,
      createdAt: worker.createdAt,
      updatedAt: worker.updatedAt
    }
  }

  async save(worker: Worker): Promise<Worker> {
    if (worker.id) {
      const updated = await WorkerModel.findByIdAndUpdate(worker.id, worker, { new: true });
      return this.map(updated!);
    } else {
      const newWorker = new WorkerModel(worker);
      const saved = await newWorker.save();
      return this.map(saved);
    }
  }

  async findByEmail(email: string): Promise<Worker | null> {
    const worker = await WorkerModel.findOne({ email });
    return worker ? this.map(worker) : null;
  }

  async findById(id: string): Promise<Worker | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const worker = await WorkerModel.findById(id);
    return worker ? this.map(worker) : null;
  }

  async getNewAppliers(
    page: number = 1,
    limit: number = 10,
    search: string = ""
  ): Promise<{ workers: Worker[]; total: number }> {
    const skip = (page - 1) * limit;

    // Build search query for pending and rejected workers
    const searchQuery: any = { status: { $in: ["pending", "rejected"] } };

    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const [workers, total] = await Promise.all([
      WorkerModel.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }) // Latest first
        .lean(),
      WorkerModel.countDocuments(searchQuery)
    ]);

    return {
      workers: workers.map(w => this.map(w)),
      total
    };
  }

  async getAllWorkers(
    page: number = 1,
    limit: number = 10,
    search: string = ""
  ): Promise<{ workers: Worker[]; total: number }> {
    const skip = (page - 1) * limit;

    // Build search query for approved workers
    const searchQuery: any = { status: "approved" };

    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const [workers, total] = await Promise.all([
      WorkerModel.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      WorkerModel.countDocuments(searchQuery)
    ]);

    return {
      workers: workers.map(w => this.map(w)),
      total
    };
  }

  async getWorkersCount(): Promise<number> {
    const count = await WorkerModel.countDocuments({ status: "approved" });
    return count;
  }
}
