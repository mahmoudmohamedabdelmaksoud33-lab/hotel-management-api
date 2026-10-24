import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { RegisterDTO, LoginDTO } from "../dtos/auth.dto";

const authService = new AuthService();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = RegisterDTO.parse(req.body);
    const user = await authService.register(validatedData);

    res.status(201).json({
      message: "User registered successfully! 🚀",
      user,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: error.message || "Registration failed", error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = LoginDTO.parse(req.body);
    const result = await authService.login(validatedData);

    res.status(200).json({
      message: "Login successful! 🔓",
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Login failed" });
  }
};
