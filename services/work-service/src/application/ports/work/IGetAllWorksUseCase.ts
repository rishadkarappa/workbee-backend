import { WorkResponseDto } from "../../dtos/WorkDTO";

export interface IGetAllWorksUseCase {
    execute(): Promise<WorkResponseDto[]>;
}
