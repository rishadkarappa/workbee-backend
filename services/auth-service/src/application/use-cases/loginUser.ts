import { UserModel } from "../../infrastructure/database/models/UserSchema";
import { comparePassword } from "../../infrastructure/security/bcrypt";
import { generateToken } from "../../infrastructure/security/jwt";

export const loginUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("the user not exist");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("invalid password");
  } 

  const token = generateToken(user._id.toString());
  return { user, token };

};
