import { Router } from "express";
import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Register a new user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create new user
    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Include username and isAdmin in response
    res.json({
      token,
      username: user.username,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// New route to set admin status
router.post(
  "/make-admin",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { username } = req.body;

      // Get the requesting user
      const requestingUser = await User.findById(
        (req as unknown as { user: { userId: string } }).user?.userId
      );

      // Check if requesting user is admin
      if (!requestingUser?.isAdmin) {
        return res
          .status(403)
          .json({ message: "Only admins can create other admins" });
      }

      const userToUpdate = await User.findOne({ username });
      if (!userToUpdate) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user is already an admin
      if (userToUpdate.isAdmin) {
        return res.status(400).json({ message: "User is already an admin" });
      }

      // Update the user's admin status
      userToUpdate.isAdmin = true;
      await userToUpdate.save();

      res.json({ message: `User ${username} is now an admin` });
    } catch (error) {
      res.status(500).json({ message: "Error updating admin status" });
    }
  }
);

export const authRouter = router;
