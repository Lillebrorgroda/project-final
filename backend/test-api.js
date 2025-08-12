import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const API_KEY = process.env.PERENUAL_API_KEY
console.log("Testing Perenual API...")
console.log("API Key exists:", !!API_KEY)

if (!API_KEY) {
  console.log("❌ PERENUAL_API_KEY missing in .env file")
  process.exit(1)
}

try {
  console.log("🔍 Testing API call...")
  const response = await axios.get(`https://perenual.com/api/species-list`, {
    params: {
      key: API_KEY,
      q: "tomato",
    },
  })

  console.log("✅ API call successful!")
  console.log("Response data:", response.data.data?.[0] || "No data")
} catch (err) {
  console.error("❌ API call failed:", err.message)
  if (err.response) {
    console.error("Status:", err.response.status)
    console.error("Data:", err.response.data)
  }
}