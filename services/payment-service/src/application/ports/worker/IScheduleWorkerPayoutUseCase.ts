export interface IScheduleWorkerPayoutUseCase {
  execute(workId: string): Promise<{ paymentId: string; workerPayout: number } | null>;
}