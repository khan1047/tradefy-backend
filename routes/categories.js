import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// GET ALL CATEGORIES
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

export default router;
