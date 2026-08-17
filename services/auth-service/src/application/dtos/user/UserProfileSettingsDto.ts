export interface UserProfileSettingsRequestDto {
    userId : string
}
export interface UserProfileSettingsResponseDto {
    name : string;
    email : string;
    phone? : string;
    createdAt? : Date;
    updatedAt? : Date;
}
