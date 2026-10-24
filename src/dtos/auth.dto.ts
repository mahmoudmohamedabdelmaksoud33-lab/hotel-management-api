import { z } from "zod";

export const RegisterDTO = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().optional(),
});

export const LoginDTO = z.object({
  email: z.string().email("Invalid email address format"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof RegisterDTO>;
export type LoginInput = z.infer<typeof LoginDTO>;
