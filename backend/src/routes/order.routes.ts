import { Router } from 'express';
import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Menu } from '../models/Menu';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Place a new order
router.post('/', authenticateToken, async (req: Request & { user?: { userId: string } }, res: Response) => {
  try {
    const { items } = req.body;
    const userId = req.user?.userId; // Changed from req.user.id

    if (!userId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItem);
      if (!menuItem || !menuItem.availability) {
        return res.status(400).json({ 
          message: `Menu item ${item.menuItem} is not available` 
        });
      }
      totalAmount += menuItem.price * item.quantity;
    }

    const order = new Order({
      userId,
      items,
      totalAmount,
      status: 'Pending'
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Get user's orders
router.get('/', authenticateToken, async (req: Request & { user?: { userId: string } }, res: Response) => {
  try {
    const userId = req.user?.userId; // Changed from req.user.id

    if (!userId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const orders = await Order.find({ userId })
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

export const orderRouter = router; 