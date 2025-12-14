// import { User } from "../../domain/entities/User";
// import { LoginAdminResponseDTO } from "../dtos/admin/LoginAdminDTO";

// export class AdminMapper {
//   static toSafeAdmin(admin: User) {
//     return {
//       id: admin.id!,
//       _id: admin.id!,
//       name: admin.name,
//       email: admin.email!,
//       role: admin.role!
//     };
//   }

//   static toLoginResponse(admin: User, token: string): LoginAdminResponseDTO {
//     return {
//       user: AdminMapper.toSafeAdmin(admin),  
//       token
//     };
//   }
// }

// Backend/services/auth-service/src/application/mappers/AdminMapper.ts

import { User } from "../../domain/entities/User";
import { LoginAdminResponseDTO } from "../dtos/admin/LoginAdminDTO";

export class AdminMapper {
  static toSafeAdmin(admin: User) {
    return {
      id: admin.id!,
      _id: admin.id!,
      name: admin.name,
      email: admin.email!,
      role: admin.role!
    };
  }

  static toLoginResponse(admin: User, accessToken: string, refreshToken: string): LoginAdminResponseDTO {
    return {
      user: AdminMapper.toSafeAdmin(admin),
      accessToken,
      refreshToken
    };
  }
}