import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";

dotenv.config();

const categories = [
  {
    name: "Mobiles",
    slug: "mobiles",
    subcategories: ["Smartphones", "Accessories"]
  },
  {
    name: "Cars",
    slug: "cars",
    subcategories: ["Sedan", "SUV", "Hatchback"]
  },
  {
    name: "Properties",
    slug: "properties",
    subcategories: ["House", "Apartment", "Land"]
  },
  {
    name: "Jobs",
    slug: "jobs",
    subcategories: ["IT", "Sales", "Delivery"]
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Category.deleteMany({});
  await Category.insertMany(categories);
  console.log("✅ Categories seeded");
  process.exit();
}

seed();
