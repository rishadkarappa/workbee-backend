import { inject, injectable } from "tsyringe";
import { IGetLiveWorksUseCase } from "../../ports/user/IGetLiveWorksUseCase";
import { IWorkRepository } from "../../../domain/repositories/IWorkRepository";
import { GetLiveWorksParams } from "../../dtos/user/GetLiveWorksDTO";

const DEFAULT_LIMIT = 6;

@injectable()
export class GetLiveWorksUseCase implements IGetLiveWorksUseCase {
  constructor(
    @inject("WorkRepository") private readonly _workRepository: IWorkRepository
  ) {}

  async execute(params: GetLiveWorksParams) {
    const { userId } = params;
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : DEFAULT_LIMIT;
    const bucket = params.bucket ?? 'active';

    const [{ works, total }, counts] = await Promise.all([
      this._workRepository.getLiveWorksByUserId(userId, { page, limit, bucket }),
      this._workRepository.countLiveWorkBuckets(userId),
    ]);

    return {
      works,
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
      counts,
    };
  }
}