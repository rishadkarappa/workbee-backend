// import { injectable } from "tsyringe";
// import axios from "axios";
// import { IAuthServiceClient } from "../../domain/services/IAuthServiceClient";
// import { ENV } from "../config/env";

// @injectable()
// export class AuthServiceClient implements IAuthServiceClient {
//   private readonly client = axios.create({
//     baseURL: ENV.AUTH_SERVICE_URL, // e.g. http://auth-service:5001
//     headers: { "x-internal-secret": ENV.INTERNAL_SERVICE_SECRET },
//     timeout: 5000,
//   });

//   async blockUser(userId: string): Promise<void> {
//     await this.client.patch(`/auth/internal/users/${userId}/block`);
//   }

//   async blacklistUser(userId: string): Promise<void> {
//     await this.client.patch(`/auth/internal/users/${userId}/blacklist`);
//   }

//   async sendWarningEmail(userId: string, reason: string): Promise<void> {
//     await this.client.post(`/auth/internal/users/${userId}/warning-email`, { reason });
//   }
// }