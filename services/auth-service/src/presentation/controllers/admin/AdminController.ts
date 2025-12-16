import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "../../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../../shared/helpers/responseHelper";
import { ResponseMessage } from "../../../shared/constants/ResponseMessages";

import { LoginAdminRequestDTO } from "../../../application/dtos/admin/LoginAdminDTO";

import { ILoginAdminUseCase } from "../../../application/ports/admin/ILoginAdminUseCase";
import { IGetUsersUseCase } from "../../../application/ports/admin/IGetUsersUseCase";

import { IAdminContoller } from "../../ports/IAdminController";
import { IBlockUserUseCase } from "../../../application/ports/admin/IBlockUserUseCase";

@injectable()
export class AdminController implements IAdminContoller {
    constructor(
        @inject("LoginAdminUseCase") private _loginAdminUseCase: ILoginAdminUseCase,
        @inject("GetUsersUseCase") private _getUsersUseCase: IGetUsersUseCase,
        @inject("BlockUserUseCase") private _blockUserUseCase: IBlockUserUseCase,
    ) { }

    async adminLogin(req: Request, res: Response) {
        try {
            // const {email, password} = req.body;
            const dto: LoginAdminRequestDTO = req.body
            const result = await this._loginAdminUseCase.execute(dto)
            res.status(HttpStatus.OK).json(ResponseHelper.success(result, ResponseMessage.ADMIN.LOGINED_SUCCESFULLY))
        } catch (err: any) {
            res.status(HttpStatus.UNAUTHORIZED).json(ResponseHelper.error(err.message, HttpStatus.BAD_REQUEST))
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";

            const result = await this._getUsersUseCase.execute(page, limit, search);

            res.status(HttpStatus.OK).json(
                ResponseHelper.success(
                    {
                        users: result.users,
                        total: result.total,
                        page,
                        limit,
                        totalPages: Math.ceil(result.total / limit)
                    },
                    ResponseMessage.ADMIN.GET_USERS
                )
            );
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(
                ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST)
            );
        }
    }

    async blockUser(req: Request, res: Response) {
        try {
            const userId = req.params.id
            const result = await this._blockUserUseCase.execute(userId)
            res.status(HttpStatus.OK).json(ResponseHelper.success(result, "ResponseMessage.ADMIN.BLOCKED_USER"))
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.NOT_FOUND))
        }
    }


}