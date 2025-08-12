import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

console.log("Testing database connection...")
console.log("MongoDB URL:", process.env.MONGO_URL)

try {
  await mongoose.connect(process.env.MONGO_URL)
  console.log("✅ Connected to MongoDB!")
  mongoose.disconnect()
} catch (err) {
  console.error("❌ MongoDB error:", err.message)
}