import { GetUserProfileStatDto, GetUserProfileStatResponseDto, } from "../../dtos/worker/GetUserProfileStatDTO";

export interface IGetUserProfileStatUseCase {
  execute(dto: GetUserProfileStatDto): Promise<GetUserProfileStatResponseDto>;
}