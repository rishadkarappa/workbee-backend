import { LoginAdminRequestDTO, LoginAdminResponseDTO } from "../../dtos/admin/LoginAdminDTO";

export interface ILoginAdminUseCase {
  execute(data: LoginAdminRequestDTO): Promise<LoginAdminResponseDTO>;
}
