export interface GetWorkerAssignedWorksDto {
    workerId: string;
}

export interface GetWorkerAssignedWorksResponseDto {
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