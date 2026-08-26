export interface ICheckReviewExistsUseCase {
  execute(workId: string): Promise<{ exists: boolean }>;
}