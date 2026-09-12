export interface GetWorkerAssignedWorksDto {
  workerId: string;
  page?: number;
  limit?: number;
  bucket?: 'all' | 'assigned' | 'started' | 'ongoing' | 'completed';
  startDate?: string;
  endDate?: string;
}

export interface WorkItemDto {
  id: string;
  userId: string;
  workTitle: string;
  workCategory: string;
  workType: 'oneDay' | 'multipleDay';
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  progress?: 'started' | 'ongoing' | 'completed';
  budget?: number;
  startDate?: string;
  endDate?: string;
  description: string;
  manualAddress?: string;
  createdAt: Date;
}

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface WorkerBucketCountsDto {
  all: number;
  assigned: number;
  started: number;
  ongoing: number;
  completed: number;
}

export interface GetWorkerAssignedWorksResponseDto {
  works: WorkItemDto[];
  pagination: PaginationDto;
  counts: WorkerBucketCountsDto;
}