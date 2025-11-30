import { injectable } from "tsyringe";
import { IWorkRepository } from "../../../domain/repositories/IWorkRepository";
import { Work } from "../../../domain/entities/Work";
import { WorkModel } from "../models/WorkSchema";

@injectable()
export class MongoWorkRepository implements IWorkRepository {
    async create(work: Work): Promise<Work> {
        const createdWork = await WorkModel.create(work);
        return this.mapToEntity(createdWork);
    }

    async findById(id: string): Promise<Work | null> {
        const work = await WorkModel.findById(id);
        return work ? this.mapToEntity(work) : null;
    }

    async findByUserId(userId: string): Promise<Work[]> {
        const works = await WorkModel.find({ userId }).sort({ createdAt: -1 });
        return works.map(this.mapToEntity);
    }

    async findAll(): Promise<Work[]> {
        const works = await WorkModel.find().sort({ createdAt: -1 });
        return works.map(this.mapToEntity);
    }

    async update(id: string, WorkData: Partial<Work>): Promise<Work | null> {
        const updated = await WorkModel.findByIdAndUpdate(id, WorkData, { new: true });
        return updated ? this.mapToEntity(updated) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await WorkModel.findByIdAndDelete(id);
        return !!result;
    }

    private mapToEntity(doc: any): Work {
        return {
            id: doc._id.toString(),
            userId: doc.userId,
            workTitle: doc.workTitle,
            workCategory: doc.workCategory,
            workType: doc.workType,
            date: doc.date,
            startDate: doc.startDate,
            endDate: doc.endDate,
            time: doc.time,
            description: doc.description,
            voiceFile: doc.voiceFile,
            videoFile: doc.videoFile,
            duration: doc.duration,
            budget: doc.budget,
            location:doc.location,
            currentLocation: doc.currentLocation,
            manualAddress: doc.manualAddress,
            landmark: doc.landmark,
            place: doc.place,
            contactNumber: doc.contactNumber,
            beforeImage: doc.beforeImage,
            petrolAllowance: doc.petrolAllowance,
            extraRequirements: doc.extraRequirements,
            anythingElse: doc.anythingElse,
            termsAccepted: doc.termsAccepted,
            status: doc.status,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }
}