import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role?: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { userId: string; role?: string };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking admin status" });
  }
};
