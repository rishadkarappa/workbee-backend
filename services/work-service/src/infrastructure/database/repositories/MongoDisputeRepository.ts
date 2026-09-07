import { injectable } from "tsyringe";
import { FilterQuery } from "mongoose";
import { IDisputeRepository } from "../../../domain/repositories/IDisputeRepository";
import { Dispute, DisputeAction, DisputeStatus, NewDispute } from "../../../domain/entities/Dispute";
import { DisputeModel, DisputeDocument } from "../models/DisputeSchema";

@injectable()
export class MongoDisputeRepository implements IDisputeRepository {
  private map(doc: DisputeDocument): Dispute {
    return {
      id: doc._id.toString(),
      workId: doc.workId,
      workTitle: doc.workTitle,
      userId: doc.userId,
      workerId: doc.workerId,
      complaintType: doc.complaintType,
      description: doc.description,
      proofImages: doc.proofImages,
      proofVideo: doc.proofVideo,
      status: doc.status,
      actions: doc.actions,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async create(dispute: NewDispute): Promise<Dispute> {
    const created = await DisputeModel.create({ ...dispute, status: "pending", actions: [] });
    return this.map(created);
  }

  async findById(id: string): Promise<Dispute | null> {
    const doc = await DisputeModel.findById(id);
    return doc ? this.map(doc) : null;
  }

  async findByUserId(userId: string): Promise<Dispute[]> {
    const docs = await DisputeModel.find({ userId }).sort({ createdAt: -1 });
    return docs.map((d) => this.map(d));
  }

  async findByWorkerId(workerId: string): Promise<Dispute[]> {
    const docs = await DisputeModel.find({ workerId }).sort({ createdAt: -1 });
    return docs.map((d) => this.map(d));
  }

  async findAll(filters: {
    page: number;
    limit: number;
    status?: string;
    search?: string;
  }): Promise<{ disputes: Dispute[]; total: number }> {
    const { page, limit, status, search } = filters;
    const skip = (page - 1) * limit;

    const query: FilterQuery<DisputeDocument> = {};
    if (status && status !== "all") query.status = status as DisputeStatus;
    if (search && search.trim()) {
      query.$or = [
        { workTitle: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [docs, total] = await Promise.all([
      DisputeModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      DisputeModel.countDocuments(query),
    ]);

    return { disputes: docs.map((d) => this.map(d)), total };
  }

  async addAction(id: string, action: DisputeAction, newStatus: DisputeStatus): Promise<Dispute | null> {
    const updated = await DisputeModel.findByIdAndUpdate(
      id,
      { $push: { actions: action }, $set: { status: newStatus } },
      { new: true }
    );
    return updated ? this.map(updated) : null;
  }

  async countActionsForWorker(workerId: string): Promise<number> {
    const result = await DisputeModel.aggregate([
      { $match: { workerId } },
      { $unwind: "$actions" },
      { $match: { "actions.actionType": { $regex: /_worker$/ } } },
      { $count: "total" },
    ]);
    return result.length ? result[0].total : 0;
  }

  async countActionsForUser(userId: string): Promise<number> {
    const result = await DisputeModel.aggregate([
      { $match: { userId } },
      { $unwind: "$actions" },
      { $match: { "actions.actionType": { $regex: /_user$/ } } },
      { $count: "total" },
    ]);
    return result.length ? result[0].total : 0;
  }
}