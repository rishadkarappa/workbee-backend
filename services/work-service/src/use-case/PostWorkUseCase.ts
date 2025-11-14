import { inject, injectable } from "tsyringe";
import { IWorkRepository } from "../domain/repositories/IWorkRepository";
import { Work } from "../domain/entities/Work";

@injectable()
export class PostWorkUseCase {
    constructor(
        @inject("WorkRepository") private workRepository: IWorkRepository
    ) {}

    async execute(workData: Work): Promise<Work> {
        // Validate required fields
        if (!workData.userId) {
            throw new Error("User ID is required");
        }

        if (!workData.workTitle || !workData.workCategory || !workData.contactNumber) {
            throw new Error("Please fill all required fields");
        }

        if (!workData.workType) {
            throw new Error("Please select work duration type");
        }

        // Validate work type specific fields
        if (workData.workType === 'oneDay' && !workData.date) {
            throw new Error("Date is required for one day work");
        }

        if (workData.workType === 'multipleDay' && (!workData.startDate || !workData.endDate)) {
            throw new Error("Start date and end date are required for multiple day work");
        }

        if (!workData.time) {
            throw new Error("Time is required");
        }

        if (!workData.termsAccepted) {
            throw new Error("Please accept terms and conditions");
        }

        // Validate description minimum length
        if (workData.description && workData.description.split(' ').length < 2) {
            throw new Error("Description must be at least 3 words");
        }

        // Create work
        const work = await this.workRepository.create(workData);
        return work;
    }
}