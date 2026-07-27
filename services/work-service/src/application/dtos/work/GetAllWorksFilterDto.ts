export interface GetAllWorksFilterDto {
    search: string;
    status: string;
    page: number;
    limit: number;
    latitude?: number;
    longitude?: number;
    maxDistance?: number;
}