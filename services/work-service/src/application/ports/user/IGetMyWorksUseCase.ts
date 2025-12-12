import { Work } from "../../../domain/entities/Work";

export interface IGetMyWorksUseCase {
    execute(userId: string): Promise<{ works: Work[] | null }>;
}