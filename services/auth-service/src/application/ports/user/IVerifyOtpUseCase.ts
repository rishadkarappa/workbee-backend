import { VerifyOtpRequestDTO, VerifyOtpResponseDTO } from "../../dtos/user/VerifyOtpDTO";

export interface IVerifyOtpUseCase {
  execute(data: VerifyOtpRequestDTO): Promise<VerifyOtpResponseDTO>;
}
