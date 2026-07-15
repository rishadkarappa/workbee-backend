/**
 * GetWorkerProfilesBatchDtos
 */

// Request Dto
export interface GetWorkerProfilesBatchDto {
    workerIds: string[];
}

// Response Dto
export interface WorkerProfilesDto {
    id?:string
    name:string;
    email:string;
    role:string;
}

export type GetWorkerProfilesBatchResponseDto = WorkerProfilesDto[]