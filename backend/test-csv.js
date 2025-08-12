import fs from "fs"
import csv from "csv-parser"
import dotenv from "dotenv"

dotenv.config()

console.log("Testing CSV reading...")
console.log("Working directory:", process.cwd())

const results = []

if (!fs.existsSync("data/plants.csv")) {
  console.log("❌ CSV file not found at: data/plants.csv")
  console.log("📁 Files in data folder:")
  try {
    const files = fs.readdirSync("data")
    console.log(files)
  } catch (err) {
    console.log("❌ Data folder doesn't exist")
  }
  process.exit(1)
}

fs.createReadStream("data/plants.csv")
  .pipe(csv())
  .on("data", (data) => {
    results.push(data)
    if (results.length <= 3) {
      console.log(`Row ${results.length}:`, data)
    }
  })
  .on("end", () => {
    console.log(`✅ Successfully read ${results.length} plants from CSV`)
    console.log("First plant keys:", Object.keys(results[0] || {}))
  })
  .on("error", (err) => {
    console.error("❌ CSV reading error:", err.message)
  })