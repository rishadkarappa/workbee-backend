import { NextFunction, Request, Response } from "express"
import { HttpStatus } from "../../shared/enums/HttpStatus"
import { ErrorMessages } from "../../shared/constants/ErrorMessages"
import { ResponseHelper } from "../../shared/helpers/responseHelper"
import { AppError } from "workbee-common";

/**
 * Global error handling middlwere that come/catch infra errors 
 * Standardized error response
 * 
 */

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
    console.error(err);

    if (err instanceof AppError) {
        res.status(err.statusCode).json(
            ResponseHelper.error(err.message, err.statusCode)
        );
        return;
    }

    if (err instanceof Error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            ResponseHelper.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        );
        return;
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        ResponseHelper.error(
            ErrorMessages.GENERAL.INTERNAL_SERVER_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR
        )
    );
};