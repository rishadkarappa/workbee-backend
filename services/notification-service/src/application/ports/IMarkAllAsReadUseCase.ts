import { MarkAllAsReadDTO } from "../dtos/MarkAllAsReadDTO";

export interface IMarkAllAsReadUseCase {
  execute(dto: MarkAllAsReadDTO): Promise<boolean>;
}
