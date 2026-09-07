export interface UserProfileRpcUser {
  id: string;
  name: string;
  email: string;
  userProfileImage?: string;
  isBlocked: boolean;
  isBlacklisted: boolean;
}

export interface UserProfileRpcResponse {
  success: boolean;
  user?: UserProfileRpcUser;
  error?: string;
}

export interface IGetUserProfileRpcClient {
  getUserProfile(userId: string): Promise<UserProfileRpcResponse>;
}