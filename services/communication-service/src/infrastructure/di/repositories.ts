import { container } from "tsyringe";

import { ChatRepository } from "../database/repositories/ChatRepository";
import { MessageRepository } from "../database/repositories/MessageRepository";
import { IChatRepository } from "../../domain/repositories/IChatRepository";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { BidRepository } from "../database/repositories/BidRepository";
import { IBidRepository } from "../../domain/repositories/IBidRepository";

container.register<IChatRepository>("ChatRepository", { useClass: ChatRepository });
container.register<IMessageRepository>("MessageRepository", { useClass: MessageRepository });
container.register<IBidRepository>('BidRepository', { useClass: BidRepository });