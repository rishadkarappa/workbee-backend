import { UpdateUserProfileRequestDTO } from "../../../dtos/user/UpdateUserProfileDTO";
import { UserProfileSettingsResponseDto } from "../../../dtos/user/UserProfileSettingsDto";

export interface IUpdateUserProfileUseCase {
  execute(dto: UpdateUserProfileRequestDTO): Promise<UserProfileSettingsResponseDto>;
}