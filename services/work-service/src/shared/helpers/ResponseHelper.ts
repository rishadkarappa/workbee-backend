import { HttpStatus } from "../enums/HttpStatus";

export interface ApiResponseModel<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errors?: any;
}

export class ResponseHelper {
  static success<T>(
    data: T,
    message = "Request Successful",
    statusCode: number = HttpStatus.OK
  ): ApiResponseModel<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  static error(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    errors?: any
  ): ApiResponseModel<null> {
    return {
      success: false,
      statusCode,
      message,
      errors,
    };
  }
}
