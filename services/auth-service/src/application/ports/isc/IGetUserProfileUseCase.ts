
export interface IUserProfile {
    id:string;
    name:string;
    email:string;
    role:string;
    createdAt:Date | undefined;
}

export interface IGetUserProfileUseCase {
    execute(userId:string):Promise<IUserProfile>
}
