import { PostWorkDto, WorkResponseDto } from "../../dtos/WorkDTO";

export interface IPostWorkUseCase {
    execute(dto: PostWorkDto): Promise<WorkResponseDto>;
}
