import { UpdateWorkDto, WorkResponseDto } from "../../dtos/WorkDTO";


export interface IUpdateWorkUseCase{
    execute(dto:UpdateWorkDto):Promise<WorkResponseDto>;
}