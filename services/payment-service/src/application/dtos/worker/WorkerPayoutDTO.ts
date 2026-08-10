export interface ScheduleWorkerPayoutRequestDTO {
  workId: string;
}
export interface ScheduleWorkerPayoutResponseDTO {
  scheduled: boolean;
  paymentId?: string;
  workerPayout?: number;
}


export interface ReleaseWorkerPayoutRequestDTO {
  paymentId: string;
}
export interface ReleaseWorkerPayoutResponseDTO {
  released: boolean;
  workerId?: string;
  amount?: number;
}