import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { WebSocketServer } from "ws";

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
// -------------------------------
// WEBSOCKET CHAT SERVER
// -------------------------------
const wss = new WebSocketServer({ port: 5002 });

const rooms = {}; // { roomId: Set<ws> }

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());

    const { type, roomId, text, sender } = data;

    // Join room
    if (type === "join") {
      if (!rooms[roomId]) rooms[roomId] = new Set();
      rooms[roomId].add(ws);
      ws.roomId = roomId;
      return;
    }

    // Send message
    if (type === "message") {
      rooms[roomId]?.forEach((client) => {
        if (client.readyState === 1) {
          client.send(
            JSON.stringify({
              sender,
              text,
              time: new Date().toISOString(),
            })
          );
        }
      });
    }
  });

  ws.on("close", () => {
    if (ws.roomId && rooms[ws.roomId]) {
      rooms[ws.roomId].delete(ws);
    }
  });
});

console.log("💬 WebSocket chat running on ws://localhost:5002");
