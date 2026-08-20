import { inject, injectable } from "tsyringe";
import { IUpdateProfileImageUseCase } from "../../ports/user/IUpdateProfileImageUseCase";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UpdateProfileImageReqDTO, UpdateProfileImageResponseDTO } from "../../dtos/user/UserProfileImageUploadDTO";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

@injectable()
export class UpdateProfileImageUseCase implements IUpdateProfileImageUseCase {
    constructor(
        @inject("UserRepository") private readonly _userRepository: IUserRepository
    ) { }

    async execute(dto: UpdateProfileImageReqDTO): Promise<UpdateProfileImageResponseDTO> {

        const user = await this._userRepository.findById(dto.userId);

        if (!user) throw new Error(ErrorMessages.USER.NOT_FOUND);

        const isUpdated = await this._userRepository.updateProfileImage(
            dto.userId,
            dto.imageUrl,
            dto.publicId
        );

        if (!isUpdated) {
            throw new Error(ErrorMessages.USER.FAILED_TO_UPDATE_PROFILE_IMAGE);
        }

        return {
            isUpdated: true
        };
    }
}