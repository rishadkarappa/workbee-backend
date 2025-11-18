export interface ITokenService{
    generate(id:string):string;
    verify(token:string):{id:string}
}

// export interface ITokenService {
//   generateAccess(id: string): string;
//   generateRefresh(id: string): string;
//   verifyAccess(token: string): { id: string };
//   verifyRefresh(token: string): { id: string };
// }
