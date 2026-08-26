export interface GetUserProfileStatDto {
  userId: string;
}

export interface GetUserProfileStatResponseDto {
  id: string;
  name: string;
  userProfileImage?: string;
}