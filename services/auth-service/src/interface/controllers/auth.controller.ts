import { Request, Response } from "express";
import { registerUser } from "../../application/use-cases/registerUser";
import { loginUser } from "../../application/use-cases/loginUser";

export const register = async (req: Request, res: Response) => {
  try {
    console.log('jjjjjjjjjjjjjjj')
    
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    console.log('us'+user)
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.json({ success: true, user, token })
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
