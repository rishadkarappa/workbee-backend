export type WorkProgress = 'started' | 'ongoing' | 'completed';

/** work progress change to publish event to notify */
export interface IWorkProgressChangedEvent {
    workId:string;
    userId:string;
    workerId:string;
    progress: WorkProgress;
}