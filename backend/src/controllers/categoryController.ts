import { Request, Response } from "express";
import { Category } from "../models/Category";
import { Menu } from "../models/Menu";

export const categoryController = {
  // Get all categories
  getAll: async (req: Request, res: Response) => {
    try {
      const categories = await Category.find({ isActive: true });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  },

  // Create new category
  create: async (req: Request, res: Response) => {
    try {
      const category = new Category(req.body);
      const formattedName = category.name.trim();
      if (!formattedName) {
        return res.status(400).json({ message: "Category name is required" });
      }

      const existingCategory = await Category.findOne({
        name: formattedName,
      });
      if (existingCategory) {
        return res.status(400).json({ message: "Category already exists" });
      }

      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Error creating category" });
    }
  },
};
