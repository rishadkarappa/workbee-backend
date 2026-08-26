import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { GetUserProfileStatDto, GetUserProfileStatResponseDto, } from "../../dtos/worker/GetUserProfileStatDTO";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";
import { IGetUserProfileStatUseCase } from "../../ports/worker/IGetUserProfileStatUseCase";

@injectable()
export class GetUserProfileStatUseCase implements IGetUserProfileStatUseCase {
  constructor(
    @inject("UserRepository") private readonly _userRepository: IUserRepository
  ) {}

  async execute(dto: GetUserProfileStatDto): Promise<GetUserProfileStatResponseDto> {
    const user = await this._userRepository.findById(dto.userId);

    if (!user) {
      throw new Error(ErrorMessages.USER.NOT_FOUND);
    }

    // Only expose fields safe for another party (worker) to see —
    // never return email/password/isBlocked etc. through this inter-service route.

    return {
      id: user.id,
      name: user.name,
      userProfileImage: user.userProfileImage,
    };
  }
}