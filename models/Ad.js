import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true, // 🔑 IMPORTANT
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      default: "approved",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ad", adSchema);
