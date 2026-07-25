import { JwtPayload } from "jsonwebtoken";

export interface IJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  role: "user" | "worker" | "admin";
}
