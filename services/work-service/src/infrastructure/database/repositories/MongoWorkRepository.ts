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

    async findAll(filters?: {
        search?: string;
        status?: string;
        page?: number;
        limit?: number;
        latitude?: number;
        longitude?: number;
        maxDistance?: number;
    }): Promise<{ works: Work[]; total: number }> {
        const {
            search = '',
            status = 'all',
            page = 1,
            limit = 10,
            latitude,
            longitude,
            maxDistance
        } = filters || {};

        const skip = (page - 1) * limit;

        //  Check if geospatial filtering is requested
        const hasGeoFilter = latitude !== undefined &&
            longitude !== undefined &&
            maxDistance !== undefined;

        if (hasGeoFilter) {
            //  Use MongoDB $geoNear aggregation for distance-based queries
            const pipeline: any[] = [
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [longitude, latitude] // [lng, lat]
                        },
                        distanceField: "calculatedDistance",
                        maxDistance: maxDistance! * 1000, // Convert km to meters
                        spherical: true,
                        query: {} // Will be populated below
                    }
                }
            ];

            // Build additional filters
            const matchQuery: any = {};

            // Search filter
            if (search && search.trim()) {
                matchQuery.$or = [
                    { workTitle: { $regex: search, $options: 'i' } },
                    { workCategory: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { manualAddress: { $regex: search, $options: 'i' } },
                    { landmark: { $regex: search, $options: 'i' } }
                ];
            }

            // Status filter
            if (status !== 'all') {
                matchQuery.status = status;
            }

            // Add match stage if we have additional filters
            if (Object.keys(matchQuery).length > 0) {
                pipeline[0].$geoNear.query = matchQuery;
            }

            // Add pagination stages
            pipeline.push(
                { $skip: skip },
                { $limit: limit }
            );

            // Execute aggregation
            const works = await WorkModel.aggregate(pipeline);

            // Get total count for pagination
            const countPipeline: any[] = [
                {
                    $geoNear: {
                        near: {
                            type: "Point" as "Point",
                            coordinates: [longitude, latitude] as [number, number]
                        },
                        distanceField: "calculatedDistance",
                        maxDistance: maxDistance! * 1000,
                        spherical: true,
                        query: matchQuery
                    }
                },
                { $count: "total" }
            ];


            const countResult = await WorkModel.aggregate(countPipeline);
            const total = countResult.length > 0 ? countResult[0].total : 0;

            return {
                works: works.map(this.mapToEntity),
                total
            };
        }

        //  Regular query without geospatial filtering
        const query: any = {};

        // Search filter
        if (search && search.trim()) {
            query.$or = [
                { workTitle: { $regex: search, $options: 'i' } },
                { workCategory: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { manualAddress: { $regex: search, $options: 'i' } },
                { landmark: { $regex: search, $options: 'i' } }
            ];
        }

        // Status filter
        if (status !== 'all') {
            query.status = status;
        }

        // Execute query with pagination
        const [works, total] = await Promise.all([
            WorkModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            WorkModel.countDocuments(query)
        ]);

        return {
            works: works.map(this.mapToEntity),
            total
        };
    }

    async update(id: string, workData: Partial<Work>): Promise<Work | null> {
        const updated = await WorkModel.findByIdAndUpdate(
            id,
            { ...workData, updatedAt: new Date() },
            { new: true }
        );
        return updated ? this.mapToEntity(updated) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await WorkModel.findByIdAndDelete(id);
        return !!result;
    }

    async getMyWorks(userId: string): Promise<{ works: Work[] | null }> {
        const works = await WorkModel.find({ userId: userId }).sort({ createdAt: -1 });
        return {
            works: works.length > 0 ? works.map(this.mapToEntity) : null
        };
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
            location: doc.location,
            currentLocation: doc.currentLocation,
            manualAddress: doc.manualAddress,
            landmark: doc.landmark,
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