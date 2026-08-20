export interface UpdateProfileImageReqDTO {
    userId: string;
    imageUrl: string;
    publicId: string;
}

export interface UpdateProfileImageResponseDTO {
    isUpdated: boolean;
}