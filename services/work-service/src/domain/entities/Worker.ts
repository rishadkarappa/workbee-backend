import { WorkerStatus } from "../../infrastructure/database/models/WorkerSchema";

export interface Worker {
    id?: string;
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
    status:WorkerStatus;
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}