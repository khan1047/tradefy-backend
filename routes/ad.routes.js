import express from "express";
import Ad from "../models/Ad.js";

const router = express.Router();

/**
 * POST /api/ads
 * Create a new ad
 */
router.post("/", async (req, res) => {
  try {
    const { title, price, location, description } = req.body;

    if (!title || !price || !location) {
      return res.status(400).json({
        message: "Title, price, and location are required",
      });
    }

    const ad = new Ad({
      title,
      price,
      location,
      description,
    });

    await ad.save();

    res.status(201).json({
      message: "Ad created successfully",
      ad,
    });
  } catch (error) {
    console.error("Create Ad Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/ads
 * Get all ads
 */
router.get("/", async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    console.error("Get Ads Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
