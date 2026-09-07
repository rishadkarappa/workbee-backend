export interface UserDisputeActionRequest {
  userId: string;
  actionType: "block" | "unblock" | "blacklist" | "unblacklist" | "warning_email";
  reason: string;
}

export interface UserDisputeActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface IUserDisputeActionClient {
  applyAction(request: UserDisputeActionRequest): Promise<UserDisputeActionResponse>;
}