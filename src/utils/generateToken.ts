import jwt from "jsonwebtoken";

export const generateToken = (payload: {
  id: string;
  role: string;
}): string => {
  const secret = process.env.JWT_SECRET || "fallback_secret";
  return jwt.sign(payload, secret, { expiresIn: "1d" });
};
