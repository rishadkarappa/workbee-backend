export interface WorkerLoginRequestDTO {
  email: string;
  password: string;
}

export interface WorkerLoginResponseDTO {
  worker: {
    id: string;
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    location: string;
    workType: string;
    preferredWorks: string[];
    status: string;
  };
  accessToken: string;
  refreshToken: string;
}

