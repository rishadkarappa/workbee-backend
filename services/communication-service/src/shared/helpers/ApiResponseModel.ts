export interface ApiResponse<T>{
    success:boolean;
    statusCode:number;
    message:String;
    data?:T;
    errors?:unknown
}