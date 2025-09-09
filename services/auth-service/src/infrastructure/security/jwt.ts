import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret2233";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
};
