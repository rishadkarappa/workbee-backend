// import { inject, injectable } from "tsyringe";
// import { IGetMyWorksUseCase } from "../../ports/user/IGetMyWorksUseCase";
// import { IWorkRepository } from "../../../domain/repositories/IWorkRepository";
// import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

// @injectable()
// export class GetMyWorksUseCase implements IGetMyWorksUseCase {
//     constructor(
//         @inject("WorkRepository") private readonly _workRepository: IWorkRepository
//     ) {}

//     async execute(userId: string) {
//         const result = await this._workRepository.getMyWorks(userId);
        
//         if (!result.works || result.works.length === 0) {
//             throw new Error(ErrorMessages.WORK.WORK_NOT_FOUND);
//         }
        
//         return result;
//     }
// }

import { inject, injectable } from "tsyringe";
import { IGetMyWorksUseCase } from "../../ports/user/IGetMyWorksUseCase";
import { IWorkRepository, UserWorkBucket } from "../../../domain/repositories/IWorkRepository";

export interface GetMyWorksParams {
  userId: string;
  page?: number;
  limit?: number;
  bucket?: UserWorkBucket;
}

const DEFAULT_LIMIT = 6;

@injectable()
export class GetMyWorksUseCase implements IGetMyWorksUseCase {
  constructor(
    @inject("WorkRepository") private readonly _workRepository: IWorkRepository
  ) {}

  async execute(params: GetMyWorksParams) {
    const { userId } = params;
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : DEFAULT_LIMIT;
    const bucket = params.bucket ?? 'all';

    const [{ works, total }, counts] = await Promise.all([
      this._workRepository.getMyWorksPaginated(userId, { page, limit, bucket }),
      this._workRepository.countUserWorkBuckets(userId),
    ]);

    return {
      works,
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
      counts,
    };
  }
}