import { User } from "../../../domain/entities/User";

export interface IVerifyUserUseCase {
  execute(authHeader?: string): Promise<User>;
}
