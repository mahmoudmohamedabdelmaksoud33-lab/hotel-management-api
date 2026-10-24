import { AppDataSource } from "../config/database";
import { User } from "../entities/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterInput, LoginInput } from "../dtos/auth.dto";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(input: RegisterInput) {
    const existingUser = await this.userRepository.findOne({
      where: { email: input.email },
    });
    if (existingUser) {
      throw new Error("Email is already in use!");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(input.password, salt);

    const newUser = this.userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role || "guest",
    });

    await this.userRepository.save(newUser);

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
  }

  async login(input: LoginInput) {
    const user = await this.userRepository.findOne({
      where: { email: input.email },
    });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const secret = process.env.JWT_SECRET || "fallback_secret";
    const token = jwt.sign({ id: user.id, role: user.role }, secret, {
      expiresIn: "1d",
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
