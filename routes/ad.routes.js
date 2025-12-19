import express from "express";
import Ad from "../models/Ad.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/**
 * GET all ads (optional category filter)
 * /api/ads?category=mobiles
 */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const ads = await Ad.find(filter).sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    console.error("Fetch ads error", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET single ad + increment views
 */
router.get("/:id", async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.json(ad);
  } catch (err) {
    console.error("Fetch ad error", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST create new ad (WITH IMAGE)
 */
router.post(
  "/",
  upload.single("image"), // 🔑 MUST be "image"
  async (req, res) => {
    try {
      const { title, price, location, description, category } = req.body;

      if (!title || !price || !location || !category) {
        return res.status(400).json({
          message: "Title, price, location and category are required",
        });
      }

      const ad = new Ad({
        title,
        price,
        location,
        description,
        category,
        images: req.file ? [req.file.path] : [],
      });

      await ad.save();

      res.status(201).json({
        message: "Ad created successfully",
        ad,
      });
    } catch (err) {
      console.error("Create ad error", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
