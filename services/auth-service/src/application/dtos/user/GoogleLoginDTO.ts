export interface GoogleLoginRequestDTO {
  credential: string;
}

// export interface UserDTO {
//   userId:string;
//   name:string;
//   email:string;
//   role:'admin'|'user'|'worker';
//   profileImage?:string
// }

export interface GoogleLoginResponseDTO {
  user: any;
  accessToken: string;
  refreshToken: string;
}