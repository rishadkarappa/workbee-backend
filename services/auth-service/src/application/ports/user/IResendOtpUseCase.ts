import { ResendOtpRequestDTO, ResendOtpResponseDTO } from "../../dtos/user/ResendOtpDTO";

export interface IResendOtpUseCase {
    execute(data: ResendOtpRequestDTO): Promise<ResendOtpResponseDTO>;
}
