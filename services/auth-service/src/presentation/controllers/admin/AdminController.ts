
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "../../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../../shared/helpers/responseHelper";
import { ResponseMessage } from "../../../shared/constants/ResponseMessages";

import { LoginAdminUseCase } from "../../../application/use-cases/admin/LoginAdminUseCase";
import { GetUsersUseCase } from "../../../application/use-cases/admin/GetUsersUseCase";
import { LoginAdminRequestDTO } from "../../../application/dtos/admin/LoginAdminDTO";

@injectable()
export class AdminController{
    constructor(
        @inject(LoginAdminUseCase) private loginAdminUseCase:LoginAdminUseCase,
        @inject(GetUsersUseCase) private getUsersUseCase:GetUsersUseCase
    ){}

    async adminLogin(req:Request, res:Response){
        try {
            // const {email, password} = req.body;
            const dto:LoginAdminRequestDTO = req.body
            const result = await this.loginAdminUseCase.execute(dto)
            res.status(HttpStatus.OK).json(ResponseHelper.success(result, ResponseMessage.ADMIN.LOGINED_SUCCESFULLY))
        } catch (err:any) {
            res.status(HttpStatus.UNAUTHORIZED).json(ResponseHelper.error(err.message, HttpStatus.BAD_REQUEST))
        }
    }

    async getUsers(req:Request, res:Response){
        try {
            const result = await this.getUsersUseCase.execute()
            res.status(HttpStatus.OK).json(ResponseHelper.success(result, ResponseMessage.ADMIN.GET_USERS))
        } catch (error:any) {
            res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.NOT_FOUND))
        }
    }

}