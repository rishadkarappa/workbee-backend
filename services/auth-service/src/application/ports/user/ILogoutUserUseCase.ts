export interface ILogoutUserUseCase {
  execute(userId: string): Promise<void>;
}