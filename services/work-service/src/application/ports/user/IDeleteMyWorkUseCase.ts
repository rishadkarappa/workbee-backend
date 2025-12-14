import { DeleteWorkDto } from "../../dtos/work/WorkDTO";

export interface IDeleteMyWorkUseCase {
    execute(dto: DeleteWorkDto): Promise<boolean>;
}
