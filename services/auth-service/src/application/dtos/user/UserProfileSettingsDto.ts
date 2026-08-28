export interface UserProfileSettingsRequestDto {
    userId: string
}
export interface UserProfileSettingsResponseDto {
    id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    bio?: string;
    userProfileImage?: string;
    createdAt?: Date;
    updatedAt?:Date;
}