export interface IReleaseWorkerPayoutUseCase {
  execute(paymentId: string): Promise<void>;
}