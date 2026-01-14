import { Chat } from "../../../domain/entities/Chat";

export interface IGetUserChatsUseCase {
  execute(
    userId: string,
    role: "user" | "worker"
  ): Promise<Chat[]>;
}
