import { UpdateWorkDto, WorkResponseDto } from "../../dtos/work/WorkDTO";


export interface IUpdateWorkUseCase{
    execute(dto:UpdateWorkDto):Promise<WorkResponseDto>;
}