export interface RecentCompletedWorkDto {
    id: string;
    workTitle: string;
    budget?: number;
    status: string;
    completedAt: Date;
}

export interface MonthlyCountDto {
    month: string;
    year: number;
    count: number;
}

export interface RecentReviewDto {
    rating: number;
    testimonial?: string;
    createdAt: Date;
}

export interface WorkerDashboardStatsResponseDto {
    totalWorksCompleted: number;
    worksCompletedThisMonth: number;
    worksCompletedLastMonth: number;
    activeWorksCount: number;
    worksDueThisWeek: number;
    avgRating: number;
    totalReviews: number;
    monthlyCompletedWorks: MonthlyCountDto[];
    recentCompletedWorks: RecentCompletedWorkDto[];
    recentReviews: RecentReviewDto[];
}