import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.join(__dirname, '../../../../../../shared/protos/user.proto');


const packageDefinition = protoLoader.loadSync(PROTO_PATH,{
    keepCase:true,
    longs:String,
    enums:String,
    defaults:true,
    oneofs:true
})

const userProto = grpc.loadPackageDefinition(packageDefinition).user as any;

export interface UserData{
    id:string;
    name:string;
    email:string;
    phone:string;
}

export class UserGrpcClient{
    private client : any;

    constructor(serverAddress:string = 'localhost:50052') {
        this.client = new userProto.UserService(
            serverAddress,
            grpc.credentials.createInsecure()
        );
    }

    getUserById(userId:string):Promise<{
        success:boolean;
        message:string;
        user:UserData|null;
    }> {
        return new Promise((resolve, reject) => {
            this.client.GetUserById({userId},(error:grpc.ServiceError|null, response:any) => {
                if (error) {
                    reject(error)
                    return;
                }
                resolve(response)
            })
        })
    }

    validateUser(userId:string):Promise<{
        success:boolean;
        message:string;
        isValid:boolean
    }> {
        return new Promise((resolve, reject) => {
            this.client.ValidateUser(
                {userId},
                (error:grpc.ServiceError|null, response:any) => {
                    if (error) {
                        reject(error)
                        return;
                    }
                    resolve(response)
                }
            )
        })
    }
}




