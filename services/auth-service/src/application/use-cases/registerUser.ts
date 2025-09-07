import { UserModel } from "../../infrastructure/db/userModel";
import { hashPassword } from "../../infrastructure/security/bcrypt";

export const registerUser = async (name: string, email: string, password: string) => {
  const existing = await UserModel.findOne({ email });
  if (existing) throw new Error("email already exists");

  const hashed = await hashPassword(password);
  const user = new UserModel({ name, email, password: hashed });
  await user.save();
  return user;
};
