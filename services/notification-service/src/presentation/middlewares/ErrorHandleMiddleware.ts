import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../shared/enums/HttpStatus";
import { ErrorMessage } from "../../shared/constants/ErrorMessages";
import { ResponseHelper } from "../../shared/helpers/ResponseHelper";


export const errorHandling = (err:any, req:Request, res:Response, next:NextFunction): void => {
    console.log(err)

    const httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR
    const message = err.message || ErrorMessage.GENERAL.INTERNAL_SERVER_ERROR

    res.status(httpStatusCode).json(ResponseHelper.error(message))
}