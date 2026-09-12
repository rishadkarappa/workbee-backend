import { Work } from "../../../domain/entities/Work";
import { GetMyWorksParams } from "../../use-case/user/GetMyWorksUseCase";

export interface IGetMyWorksUseCase {
    execute(params: GetMyWorksParams): Promise<{ works: Work[] | null }>;
}