export type WorkProgress = "started" | "ongoing" | "completed"

export interface IWorkProgressChangedEvent {
    workId: string;
    userId: string;
    workerId: string;
    progress: WorkProgress;
}
