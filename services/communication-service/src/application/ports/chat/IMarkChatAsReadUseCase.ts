import { MarkChatAsReadDTO } from "../../dtos/chat/ChatDTO";

export interface IMarkChatAsReadUseCase {
  execute(dto: MarkChatAsReadDTO): Promise<void>;
}