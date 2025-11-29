import { User } from "../../../domain/entities/User";

export interface IGetUsersUseCase {
  execute(): Promise<{ users: User[] }>;
}
