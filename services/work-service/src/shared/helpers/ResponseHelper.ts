import { IApiResponse } from "workbee-common";
import { HttpStatus } from "../enums/HttpStatus";


export class ResponseHelper {
  static success<T>(data: T, message = "Request Successful", statusCode: number = HttpStatus.OK): IApiResponse<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  static error(message: string, statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR, errors?: unknown): IApiResponse<null> {
    return {
      success: false,
      statusCode,
      message,
      errors,
    };
  }
}
