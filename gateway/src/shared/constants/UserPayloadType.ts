export interface UserPayloadType {
  id: string;
  role: "user" | "admin" | "worker";
}