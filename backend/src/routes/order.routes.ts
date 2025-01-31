import { Router } from "express";
import { orderController } from "../controllers/orderController";
import { authenticateToken } from "../middleware/auth.middleware";

export const router = Router();

router.post("/", authenticateToken, orderController.create);
router.get("/", authenticateToken, orderController.getUserOrders);

export const orderRouter = router;
