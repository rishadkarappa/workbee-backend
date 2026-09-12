import { Work } from "../entities/Work";

export type WorkerBucket = 'all' | 'assigned' | 'started' | 'ongoing' | 'completed';

export interface WorkerWorksQueryOptions {
    page: number;
    limit: number;
    bucket: WorkerBucket;
    startDate?: string;
    endDate?: string;
}

export interface WorkerBucketCounts {
    all: number;
    assigned: number;
    started: number;
    ongoing: number;
    completed: number;
}

export type UserWorkBucket = 'all' | 'active' | 'completed' | 'pending' | 'cancelled';

export interface UserWorksQueryOptions {
    page: number;
    limit: number;
    bucket: UserWorkBucket;
}

export interface UserBucketCounts {
    all: number;
    active: number;
    completed: number;
    pending: number;
    cancelled: number;
}

export type LiveWorkBucket = 'active' | 'completed';

export interface LiveWorksQueryOptions {
    page: number;
    limit: number;
    bucket: LiveWorkBucket;
}

export interface LiveWorkBucketCounts {
    active: number;
    completed: number;
}

export interface IWorkRepository {
    create(work: Work): Promise<Work>;
    findById(id: string): Promise<Work | null>;
    findByUserId(userId: string): Promise<Work[]>;
    update(id: string, workData: Partial<Work>): Promise<Work | null>;
    delete(id: string): Promise<boolean>;
    findAll(filters?: {
        search?: string;
        status?: string;
        page?: number;
        limit?: number;
        latitude?: number;
        longitude?: number;
        maxDistance?: number;
    }): Promise<{ works: Work[]; total: number }>;

    getMyWorksPaginated(userId: string, options: UserWorksQueryOptions): Promise<{ works: Work[]; total: number }>;
    countUserWorkBuckets(userId: string): Promise<UserBucketCounts>;
    
    getLiveWorksByUserId(userId: string, options: LiveWorksQueryOptions): Promise<{ works: Work[]; total: number }>;
    countLiveWorkBuckets(userId: string): Promise<LiveWorkBucketCounts>;

    getMyWorks(id: string): Promise<{ works: Work[] | null }>;
    findByWorkerId(workerId: string, options: WorkerWorksQueryOptions): Promise<{ works: Work[]; total: number }>;
    countWorkerBuckets(workerId: string): Promise<WorkerBucketCounts>;

    countCompletedByWorkerId(workerId: string): Promise<number>;

    //worker dashboard
    countActiveByWorkerId(workerId: string): Promise<number>;
    countDueThisWeek(workerId: string): Promise<number>;
    getMonthlyCompletedCounts(workerId: string, months: number): Promise<{ month: number; year: number; count: number }[]>;
    getRecentCompletedWorks(workerId: string, limit: number): Promise<Work[]>;

    // admin dash
    countAllActive(): Promise<number>;
    countAllCompleted(): Promise<number>;
}
