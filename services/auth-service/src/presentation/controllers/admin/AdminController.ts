
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "../../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../../shared/helpers/responseHelper";
import { ResponseMessage } from "../../../shared/constants/ResponseMessages";

import { LoginAdminRequestDTO } from "../../../application/dtos/admin/LoginAdminDTO";

import { ILoginAdminUseCase } from "../../../application/ports/admin/ILoginAdminUseCase";
import { IGetUsersUseCase } from "../../../application/ports/admin/IGetUsersUseCase";

import { IAdminContoller } from "../../ports/IAdminController";

@injectable()
export class AdminController implements IAdminContoller{
    constructor(
        @inject("LoginAdminUseCase") private loginAdminUseCase:ILoginAdminUseCase,
        @inject("GetUsersUseCase") private getUsersUseCase:IGetUsersUseCase
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