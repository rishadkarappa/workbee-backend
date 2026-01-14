import { Message } from "../../../domain/entities/Message";
import { SendMessageDTO } from "../../../application/dtos/chat/ChatDTO";

export interface ISendMessageUseCase {
  execute(data: SendMessageDTO): Promise<Message>;
}
