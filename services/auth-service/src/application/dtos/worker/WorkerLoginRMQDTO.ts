export interface WorkerLoginRequestRMQDTO {
  email: string;
  password: string;
  correlationId: string;
}
export interface WorkerLoginResponseRMQDTO {
  success: boolean;
  data?: any; 
  error?: string;
}