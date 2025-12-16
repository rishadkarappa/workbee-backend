import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../shared/enums/HttpStatus';
import { ResponseHelper } from '../../shared/helpers/ResponseHelper';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
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
            err.message || 'Internal Server Error',
            HttpStatus.INTERNAL_SERVER_ERROR
        )
    );
};