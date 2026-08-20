import { User } from "../../domain/entities/User";
import { LoginUserResponseDTO } from "../dtos/user/LoginUserDTO";
import { RegisterUserResponseDTO } from "../dtos/user/RegisterUserDTO";
import { GoogleLoginResponseDTO } from "../dtos/user/GoogleLoginDTO";
import { VerifyOtpResponseDTO } from "../dtos/user/VerifyOtpDTO";
import { UserProfileSettingsResponseDto } from "../dtos/user/UserProfileSettingsDto";
import { IUserProfile } from "../ports/isc/IGetUserProfileUseCase";

export class UserMapper {

  static toSafeUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked ?? false,
      createdAt: user.createdAt ?? false,
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

  static toUserProfileSettingsMapper(user: User): UserProfileSettingsResponseDto {
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      userProfileImage: user.userProfileImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  /**
   * inter service comm usecase mappers
   */
  static toUserProfile(user: User): IUserProfile {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  
}