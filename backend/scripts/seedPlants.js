import fs from "fs" // Import Node.js built in file system-modal 
import csv from "csv-parser"
import mongoose from "mongoose"
import Plant from "../models/plant.js"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const API_KEY = process.env.PERENUAL_API_KEY
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project"
mongoose.connect(mongoUrl)


const readCSVAndCombine = async () => {
  const results = []

  return new Promise((resolve, reject) => {
    fs.createReadStream("data/plants.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject)
  })
}

const fetchFromExternalAPI = async (scientificName) => {
  try {
    const response = await axios.get(`https://perenual.com/api/species-list`, {
      params: {
        key: API_KEY,
        q: scientificName,
      },
    })

    const plantData = response.data.data[0]
    return {
      imageUrl: plantData.default_image?.medium_url || "",
      sunlight: plantData.sunlight || [],
      watering: plantData.watering || "unknown",
    }
  } catch (err) {
    console.error(`Fel vid API-anrop för ${scientificName}`, err.message)
    return {}
  }
}

const seedCombinedData = async () => {
  const csvPlants = await readCSVAndCombine()
  const enrichedPlants = []

  for (const plant of csvPlants) {
    const externalData = await fetchFromExternalAPI(plant.scientificName)

    enrichedPlants.push({
      scientificName: plant.scientificName,
      swedishName: plant.swedishName,
      description: plant.description,
      imageUrl: externalData.imageUrl,
      sunlight: externalData.sunlight,
      watering: externalData.watering,
    })
  }

  try {
    await Plant.deleteMany({})
    await Plant.insertMany(enrichedPlants)
    console.log("🌱 Växtdata har importerats och kompletterats med API-data!")
  } catch (err) {
    console.error("💥 Fel vid seedning:", err.message)
  } finally {
    mongoose.disconnect()
  }
}

seedCombinedData()
