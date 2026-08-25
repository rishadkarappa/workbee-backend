import { injectable } from "tsyringe";
import { MongoBaseRepository } from "./MongoBaseRepository";
import { Worker } from "../../../domain/entities/Worker";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { WorkerModel, WorkerDocument, WorkerStatus } from "../models/WorkerSchema";
import mongoose, { FilterQuery } from "mongoose";
// import { addWorkerReviewReqDto } from "../../../application/dtos/worker/AddWorkerReviewClientReqDTO";

@injectable()
export class MongoWorkerRepository extends MongoBaseRepository<Worker, WorkerDocument> implements IWorkerRepository {
  constructor() {
    super(WorkerModel);
  }

  protected map(worker: WorkerDocument): Worker {
    return {
      id: worker._id.toString(),
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

      workerProfileImage: worker.workerProfileImage,
      workerProfileImagePublicId: worker.workerProfileImagePublicId,

      createdAt: worker.createdAt,
      updatedAt: worker.updatedAt
    }
  }

  async save(worker: Worker): Promise<Worker> {
    if (worker.id) {
      const updated = await WorkerModel.findByIdAndUpdate(worker.id, worker, { new: true });
      if (!updated) {
        throw new Error(`Worker not found for update: ${worker.id}`);
      }
      return this.map(updated);
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

    const searchQuery: FilterQuery<WorkerDocument> = {
      status: { $in: ["pending", "rejected"] }
    };

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
        .sort({ createdAt: -1 })
        .lean(),
      WorkerModel.countDocuments(searchQuery)
    ]);

    return {
      workers: workers.map(w => this.map(w as unknown as WorkerDocument)),
      total
    };
  }

  async getAllWorkers(
    page: number = 1,
    limit: number = 10,
    search: string = "",
    status: string = "all"
  ): Promise<{ workers: Worker[]; total: number }> {
    const skip = (page - 1) * limit;

    const searchQuery: FilterQuery<WorkerDocument> = { status: WorkerStatus.APPROVED };

    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (status !== "all") {
      searchQuery.isBlocked = status === "blocked";
    }

    const [workers, total] = await Promise.all([
      WorkerModel.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      WorkerModel.countDocuments(searchQuery)
    ]);

    return {
      workers: workers.map(w => this.map(w as unknown as WorkerDocument)),
      total
    };
  }

  async findByIds(ids: string[]): Promise<Worker[]> {
    const workers = await WorkerModel.find({
      _id: { $in: ids }
    }).select('-password').lean();

    return workers.map(worker => this.map(worker as unknown as WorkerDocument));
  }

  async getWorkersCount(): Promise<number> {
    const count = await WorkerModel.countDocuments({ status: WorkerStatus.APPROVED });
    return count;
  }

  async updateProfileImage(workerId: string, imageUrl: string, publicId: string): Promise<boolean> {
    const result = await WorkerModel.findByIdAndUpdate(
      workerId,
      {
        $set: {
          workerProfileImage: imageUrl,
          workerProfileImagePublicId: publicId
        }
      },
      { new: true }
    );

    return !!result;
  }

  // async addReviewField(dto: addWorkerReviewReqDto): Promise<boolean> {

  //   const addReview = await await WorkerModel.updateMany(
  //     { _id: workerId },
  //     {
  //       $set: {
  //         "review.rate": dto.rate,
  //         "review.discrption": dto.disc
  //       }
  //     }
  //   );
  // }
}