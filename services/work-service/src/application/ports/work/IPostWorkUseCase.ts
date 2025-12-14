import { PostWorkDto, WorkResponseDto } from "../../dtos/work/WorkDTO";

export interface IPostWorkUseCase {
    execute(dto: PostWorkDto): Promise<WorkResponseDto>;
}
