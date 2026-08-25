import { WorkerStatus } from "../../infrastructure/database/models/WorkerSchema";

export interface Worker {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    location: string;
    workType: string;
    preferredWorks: string[];
    confirmations: {
        reliable: boolean;
        honest: boolean;
        termsAccepted: boolean;
    };

    status: WorkerStatus;
    rejectionReason?: string;
    rejectedAt?: Date;
    canReapply?: boolean;

    workerProfileImage?: string;
    workerProfileImagePublicId?: string;

    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export type NewWorker = Omit<Worker, 'id'>;