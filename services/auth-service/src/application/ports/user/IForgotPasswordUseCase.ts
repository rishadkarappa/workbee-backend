export interface IForgotPasswordUseCase {
  execute(email: string): Promise<{ message: string }>;
}
