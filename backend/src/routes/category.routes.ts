import express from "express";
import { categoryController } from "../controllers/categoryController";
import { authenticateToken, isAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticateToken, isAdmin, categoryController.getAll);
router.post("/", authenticateToken, isAdmin, categoryController.create);

export const categoryRouter = router;
