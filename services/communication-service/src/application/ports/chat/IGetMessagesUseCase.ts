import { Message } from "../../../domain/entities/Message";
import { GetMessagesDTO } from "../../../application/dtos/chat/ChatDTO";

export interface IGetMessagesUseCase {
  execute(data: GetMessagesDTO): Promise<Message[]>;
}
