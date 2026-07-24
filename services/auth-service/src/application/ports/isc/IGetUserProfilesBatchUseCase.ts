export interface IUserProfiles {
    id:string | undefined;
    name:string;
    email:string;
    role:"user" | "admin" | "worker";
}
export interface IGetUserProfilesBatchUseCase {
    execute(userIds:string[]):Promise<IUserProfiles[]>
}