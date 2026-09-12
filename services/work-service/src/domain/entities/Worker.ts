import { WorkerStatus } from "../../infrastructure/database/models/WorkerSchema";

export interface Worker {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    location: string;
    workTypes: string[];
    preferredWorks: string[];
    bio?: string;
    confirmations: {
        reliable: boolean;
        experienced: boolean;
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

    isBlacklisted?: boolean;
    blacklistReason?: string;
    blacklistedAt?: Date;
    
    createdAt?: Date;
    updatedAt?: Date;
}

export type NewWorker = Omit<Worker, 'id'>;