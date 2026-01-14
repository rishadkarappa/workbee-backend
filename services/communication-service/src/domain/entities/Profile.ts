export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user';
}

export interface WorkerProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'worker';
  skills?: string[];
}