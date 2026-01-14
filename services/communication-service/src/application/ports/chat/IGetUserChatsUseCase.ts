import { Chat } from "../../../domain/entities/Chat";
import { GetUserChatsDTO } from "../../dtos/chat/ChatDTO";

export interface IGetUserChatsUseCase {
  execute(data: GetUserChatsDTO): Promise<Chat[]>;
}
