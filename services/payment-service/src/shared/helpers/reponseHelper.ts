import { HttpStatusCode, IApiResponse } from "workbee-common";
import { HttpStatus } from "../enums/HttpStatus";

export class ResponseHelper{

    // if response was success
    static success<T>( data:T, message= "Request successfull", statusCode:number = HttpStatus.OK):IApiResponse<T>{
        return {
            success:true,
            statusCode,
            message,
            data
        };
    }

    // if response was fail
    static error(message:string,statusCode:number = HttpStatusCode.INTERNAL_SERVER_ERROR,errors?:unknown):IApiResponse<null>{
        return {
            success:false,
            statusCode,
            message,
            errors
        }
    }
}






