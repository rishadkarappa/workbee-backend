export interface ApplyWorkerDto {
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
}

export interface WorkerResponseDto {
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
    status: "pending" | "approved" | "rejected";
    isBlocked: boolean;
    rejectionReason?: string;
    rejectedAt?: Date;
    canReapply?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface WorkerApproveDto {
    workerId: string;
    status: "approved" | "rejected";
    rejectionReason?: string;
}


/** get worker prife req and res dtos */
export interface GetWorkerProfileDto {
    workerId:string
}

export interface GetWorkerProfileReponseDto {
    id?:string;
    name:string;
    email:string;
    role : 'worker'| 'admin'|'user';
    createdAt?:Date;
}