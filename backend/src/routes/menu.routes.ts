import { Router } from "express";
import { Request, Response } from "express";
import { Menu } from "../models/Menu";
import { authenticateToken } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/auth.middleware";
import { Category } from "../models/Category";

const router = Router();

// Get all menu items
// Get all menu items with filtering
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    let query: any = {};

    // Apply category filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Apply search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        {
          category: {
            $in: await Category.find({
              name: { $regex: search, $options: "i" },
            }).distinct("_id"),
          },
        },
      ];
    }

    // Get total count for pagination
    const total = await Menu.countDocuments(query);

    // Get filtered items with pagination
    const menuItems = await Menu.find(query)
      .populate("category")
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    res.json({
      items: menuItems,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching menu items" });
  }
});

// Add new menu item (protected route)
router.post(
  "/",
  authenticateToken,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const { name, category, price, availability } = req.body;

      // Check if all fields are provided
      if (!name || !category || !price) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if the name and category is already taken
      const existingMenuItem = await Menu.findOne({ name, category });
      if (existingMenuItem) {
        return res.status(400).json({ message: "Menu item already exists" });
      }

      const menuItem = new Menu({
        name,
        category,
        price: +price,
        availability,
      });
      await menuItem.save();
      res.status(201).json(menuItem);
    } catch (error) {
      res.status(500).json({ message: "Error creating menu item" });
    }
  }
);

// Update menu item (protected route)
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const update = req.body;
      const menuItem = await Menu.findByIdAndUpdate(id, update, { new: true });
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(menuItem);
    } catch (error) {
      res.status(500).json({ message: "Error updating menu item" });
    }
  }
);

// Delete menu item (protected route)
router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const menuItem = await Menu.findByIdAndDelete(id);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json({ message: "Menu item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting menu item" });
    }
  }
);

export const menuRouter = router;
