
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "../../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../../shared/helpers/responseHelper";
import { ResponseMessage } from "../../../shared/constants/ResponseMessages";

import { LoginAdminUseCase } from "../../../application/use-cases/admin/LoginAdminUseCase";

@injectable()
export class AdminController{
    constructor(
        @inject(LoginAdminUseCase) private loginAdminUseCase:LoginAdminUseCase
    ){}

    async adminLogin(req:Request, res:Response){
        try {
            const {email, password} = req.body;
            const result = await this.loginAdminUseCase.execute(email, password)
            res.status(HttpStatus.OK).json(ResponseHelper.success(result, ResponseMessage.ADMIN.LOGINED_SUCCESFULLY))
        } catch (err:any) {
            res.status(HttpStatus.UNAUTHORIZED).json(ResponseHelper.error(err.message, HttpStatus.BAD_REQUEST))
        }
    }

    // static async adminDashboard(req:Request, res:Response){
    //     try {
            
    //     } catch (error) {
            
    //     }
    // }

}