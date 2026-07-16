import { NextFunction, Request, Response } from "express"
import { HttpStatus } from "../../shared/enums/HttpStatus"
import { ErrorMessages } from "../../shared/constants/ErrorMessages"
import { ResponseHelper } from "../../shared/helpers/responseHelper"

/**
 * Global error handling middlwere that come/catch infra errors 
 * Standardized error response
 * 
 */

export const errorHandler = (err:any, req:Request, res:Response, next:NextFunction):void => {
    console.log(err)
    const statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
    const message = err.message || ErrorMessages.GENERAL.INTERNAL_SERVER_ERROR

    res.status(statusCode).json(ResponseHelper.error(message, statusCode))
}