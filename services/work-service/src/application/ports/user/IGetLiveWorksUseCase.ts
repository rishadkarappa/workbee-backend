import { GetLiveWorksParams, GetLiveWorksResponseDto } from "../../dtos/user/GetLiveWorksDTO";


export interface IGetLiveWorksUseCase {
  execute(
    params: GetLiveWorksParams
  ): Promise<GetLiveWorksResponseDto>;
}