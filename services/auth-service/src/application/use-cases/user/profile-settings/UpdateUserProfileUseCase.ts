import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { IUpdateUserProfileUseCase } from "../../../ports/user/profile-settings/IUpdateUserProfileUseCase";
import { UpdateUserProfileRequestDTO } from "../../../dtos/user/UpdateUserProfileDTO";
import { UserProfileSettingsResponseDto } from "../../../dtos/user/UserProfileSettingsDto";
import { ErrorMessages } from "../../../../shared/constants/ErrorMessages";
import { UserMapper } from "../../../mappers/UserMapper";

@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
    constructor(
        @inject("UserRepository") private readonly _userRepository: IUserRepository
    ) { }

    async execute(dto: UpdateUserProfileRequestDTO): Promise<UserProfileSettingsResponseDto> {

        const existingUser = await this._userRepository.findById(dto.userId);

        if (!existingUser) {
            throw new Error(ErrorMessages.USER.NOT_FOUND);
        }

        const updatedUser = await this._userRepository.updateProfile(dto.userId, {
            name: dto.name,
            phone: dto.phone,
            location: dto.location,
            bio: dto.bio,
        });

        if (!updatedUser) {
            throw new Error(ErrorMessages.USER.NOT_FOUND);
        }

        return UserMapper.toUserProfileSettingsMapper(updatedUser);
    }
}