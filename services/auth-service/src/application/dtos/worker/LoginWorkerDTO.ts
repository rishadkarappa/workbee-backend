export interface WorkerLoginRequestDTO {
  email: string;
  password: string;
}
export interface WorkerLoginResponseDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}
