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

  static toLoginResponse(admin: User, token: string): LoginAdminResponseDTO {
    return {
      user: AdminMapper.toSafeAdmin(admin),  
      token
    };
  }
}