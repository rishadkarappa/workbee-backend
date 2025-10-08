export interface ITokenService{
    generate(id:string):string;
    verify(token:string):{id:string}
}