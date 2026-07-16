import { HttpStatus } from "../enums/HttpStatus";
import { ApiResponse } from "./ApiResponseModel";

export class ResponseHelper {
    static success<T>(data: T, message: "Request successfull", statusCode: number = HttpStatus.OK): ApiResponse<T> {
        return {
            success: true,
            statusCode,
            message,
            data
        }
    }

    static error(message: string, statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR, errors?:any) : ApiResponse<null> {
        return {
            success:false,
            statusCode,
            message,
            errors
        }
    }
}