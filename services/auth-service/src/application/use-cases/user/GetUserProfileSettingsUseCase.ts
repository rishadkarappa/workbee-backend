import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IGetUserProfileSettingsUseCase } from "../../ports/user/IGetUserProfileSettingsUseCase";
import { UserProfileSettingsResponseDto, UserProfileSettingsRequestDto } from "../../dtos/user/UserProfileSettingsDto";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";
import { UserMapper } from "../../mappers/UserMapper";

@injectable()
class GetUserProfileSettings implements IGetUserProfileSettingsUseCase {
    constructor(
        @inject("UserRepository") private readonly IUserRepository: IUserRepository
    ){}

    async execute(req:UserProfileSettingsRequestDto):Promise<UserProfileSettingsResponseDto> {

        const UserProfile = await this.IUserRepository.findById(req.userId)

        if ( !UserProfile ) {
            throw new Error(ErrorMessages.USER.NOT_FOUND)
        }
            
        return UserMapper.toUserProfileSettingsMapper(UserProfile)
    }
}