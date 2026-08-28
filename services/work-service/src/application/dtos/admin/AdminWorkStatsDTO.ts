export interface AdminWorkStatsResponseDto {
    totalWorkers: number;
    newWorkersThisMonth: number;
    newWorkersLastMonth: number;
    newAppliersCount: number;
    activeJobsCount: number;
    worksCompletedTotal: number;
}