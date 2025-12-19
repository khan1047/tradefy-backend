import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/auth.routes.js";
import adRoutes from "./routes/ad.routes.js";
import categoryRoutes from "./routes/categories.js";

// Models
import Ad from "./models/Ad.js";

dotenv.config();

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json());

/* -------------------- AUTH ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/categories", categoryRoutes);
/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.send("🚀 TradeFy Backend Running");
});

/* -------------------- GET ADS -------------------- */
app.get("/api/ads", async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    console.error("GET ADS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------- POST AD -------------------- */
app.post("/api/ads", async (req, res) => {
  try {
    const ad = await Ad.create(req.body);
    res.status(201).json(ad);
  } catch (err) {
    console.error("POST AD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------- DATABASE -------------------- */
     mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* -------------------- START SERVER -------------------- */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
