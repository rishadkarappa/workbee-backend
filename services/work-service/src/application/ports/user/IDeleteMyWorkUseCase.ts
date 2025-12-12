import { DeleteWorkDto } from "../../dtos/WorkDTO";

export interface IDeleteMyWorkUseCase {
    execute(dto: DeleteWorkDto): Promise<boolean>;
}
