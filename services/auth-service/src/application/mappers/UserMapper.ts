import { User } from "../../domain/entities/User";
import { LoginUserResponseDTO } from "../dtos/user/LoginUserDTO";
import { RegisterUserResponseDTO } from "../dtos/user/RegisterUserDTO";
import { GoogleLoginResponseDTO } from "../dtos/user/GoogleLoginDTO";
import { VerifyOtpResponseDTO } from "../dtos/user/VerifyOtpDTO";

export class UserMapper {

  static toSafeUser(user: User) {
    return {
      id: user.id,
      _id: user.id, 
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  static toLoginResponse(user: User, token: string): LoginUserResponseDTO {
    return {
      user: UserMapper.toSafeUser(user),
      token
    };
  }

  static toRegisterResponse(userId: string): RegisterUserResponseDTO {
    return {
      userId,
      message: "otp sent to email"
    };
  }

  static toGoogleLoginResponse(user: User, token: string): GoogleLoginResponseDTO {
    return {
      user: UserMapper.toSafeUser(user),
      token
    };
  }

  static toVerifyOtpResponse(user: User, token: string): VerifyOtpResponseDTO {
    return {
      user: UserMapper.toSafeUser(user),
      token
    };
  }
}
