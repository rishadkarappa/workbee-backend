import { MarkNotificationAsReadDTO } from "../dtos/MarkNotificationAsReadDTO";

export interface IMarkNotificationAsReadUseCase {
  execute(dto: MarkNotificationAsReadDTO): Promise<boolean>;
}
