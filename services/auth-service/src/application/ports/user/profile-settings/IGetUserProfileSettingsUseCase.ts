import { UserProfileSettingsRequestDto, UserProfileSettingsResponseDto } from "../../../dtos/user/UserProfileSettingsDto";

export interface IGetUserProfileSettingsUseCase {
    execute(req:UserProfileSettingsRequestDto) : Promise<UserProfileSettingsResponseDto>;
}