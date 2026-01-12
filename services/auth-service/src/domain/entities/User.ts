
// export interface User {
//   id?: string;
//   name: string;
//   email: string;
//   password?: string;
//   isVerified?: boolean;
//   isBlocked?:boolean;
//   role:"user"|"admin"|"worker";
//   createdAt?: Date;
//   updatedAt?:Date;
// }



// User entity in domain layer
export interface User {
  id?: string;
  _id?: any; 
  name: string;
  email: string;
  password?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  role: "user" | "admin" | "worker";
  phone?: string; 
  countofpost?: number;
  numberOfComplaints?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
