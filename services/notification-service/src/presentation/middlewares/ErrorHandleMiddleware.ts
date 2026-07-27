import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../shared/enums/HttpStatus';
import { ResponseHelper } from '../../shared/helpers/ResponseHelper';
import { AppError } from '@workbee/common';
import { ErrorMessage } from '../../shared/constants/ErrorMessages';


export const errorHandling = (err: Error | AppError, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json(
            ResponseHelper.error(err.message, err.statusCode)
        );
        return;
    }
    // Handle unexpected errors
    console.error('Unexpected Error:', err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        ResponseHelper.error(
            err.message || ErrorMessage.GENERAL.INTERNAL_SERVER_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR
        )
    );
};