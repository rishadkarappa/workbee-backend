/**
 * Interface of ChangePasswordUseCase
 */

import { ChangePasswordReqDTO, ChangePasswordResponseDTO } from "../../dtos/user/ChangePasswordDTO";

export interface IChangePasswordUseCase  {
    execute (req:ChangePasswordReqDTO):Promise<ChangePasswordResponseDTO>;
}