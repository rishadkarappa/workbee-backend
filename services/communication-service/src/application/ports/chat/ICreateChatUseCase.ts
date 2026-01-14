import { Chat } from "../../../domain/entities/Chat";
import { CreateChatDTO } from "../../../application/dtos/chat/ChatDTO";

export interface ICreateChatUseCase {
  execute(data: CreateChatDTO): Promise<Chat>;
}
