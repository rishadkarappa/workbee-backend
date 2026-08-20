import { UpdateProfileImageReqDTO, UpdateProfileImageResponseDTO } from "../../../dtos/user/UserProfileImageUploadDTO";

export interface IUpdateProfileImageUseCase {
    execute(dto: UpdateProfileImageReqDTO): Promise<UpdateProfileImageResponseDTO>;
}