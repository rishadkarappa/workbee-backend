import { GetUnreadCountDTO } from "../dtos/GetUnreadCountDTO";

export interface IGetUnreadCountUseCase {
  execute(dto: GetUnreadCountDTO): Promise<number>;
}
