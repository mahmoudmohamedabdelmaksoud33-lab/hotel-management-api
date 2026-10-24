import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access denied, no token provided!" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "fallback_secret";
    const decoded = jwt.verify(token, secret) as { id: string; role: string };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token!" });
  }
};
