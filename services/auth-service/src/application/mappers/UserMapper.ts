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

  static toLoginResponse(user: User, accessToken: string, refreshToken: string): LoginUserResponseDTO {
    return {
      user: UserMapper.toSafeUser(user),
      accessToken,
      refreshToken
    };
  }

  static toRegisterResponse(userId: string): RegisterUserResponseDTO {
    return {
      userId,
      message: "otp sent to email"
    };
  }

  static toGoogleLoginResponse(user: User, accessToken: string, refreshToken: string): GoogleLoginResponseDTO {
    return {
      user: UserMapper.toSafeUser(user),
      accessToken,
      refreshToken
    };
  }

  static toVerifyOtpResponse(user: User, accessToken: string, refreshToken: string): VerifyOtpResponseDTO {
    return {
      user: UserMapper.toSafeUser(user),
      accessToken,
      refreshToken
    };
  }
}