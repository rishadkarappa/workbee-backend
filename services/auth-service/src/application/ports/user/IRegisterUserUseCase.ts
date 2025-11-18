import { RegisterUserRequestDTO, RegisterUserResponseDTO } from "../../dtos/user/RegisterUserDTO";

export interface IRegisterUserUseCase{
    execute(data:RegisterUserRequestDTO):Promise<RegisterUserResponseDTO>;
}