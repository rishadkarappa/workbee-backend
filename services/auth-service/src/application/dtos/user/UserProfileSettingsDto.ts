export interface UserProfileSettingsRequestDto {
    userId : string
}
export interface UserProfileSettingsResponseDto {
    name : string;
    email : string;
    phone? : string;
    userProfileImage?:string
    createdAt? : Date;
    updatedAt? : Date;
}
