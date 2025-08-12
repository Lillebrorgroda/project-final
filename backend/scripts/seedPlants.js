import fs from "fs"
import csv from "csv-parser"
import mongoose from "mongoose"
import Plant from "../models/plant.js"
import axios from "axios"
import dotenv from "dotenv"
import "../data/plants.csv"

dotenv.config()

const API_KEY = process.env.PERENUAL_API_KEY
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project"
mongoose.connect(mongoUrl)

const readCSVAndCombine = async () => {
  const results = []

  return new Promise((resolve, reject) => {
    fs.createReadStream("data/plants.csv")
      .pipe(csv())
      .on("data", (data) => {
        // Hantera CSV-data med arrays
        results.push({
          scientificName: data.scientificName,
          swedishName: data.swedishName,
          description: data.description,
          companionPlants: data.companionPlants ? data.companionPlants.split(";") : [],
          edibleParts: data.edibleParts ? data.edibleParts.split(";") : [],
          // Använd CSV-data som fallback om API misslyckas
          csvSunlight: data.sunlight,
          csvWatering: data.watering,
          csvImageUrl: data.imageUrl
        })
      })
      .on("end", () => resolve(results))
      .on("error", reject)
  })
}

const fetchFromExternalAPI = async (scientificName) => {
  try {
    console.log(`🔍 Hämtar API-data för: ${scientificName}`)

    const response = await axios.get(`https://perenual.com/api/v2/species-list`, {
      params: {
        key: API_KEY,
      },
    })

    const plantData = response.data.data[0]
    if (plantData) {
      return {
        imageUrl: plantData.default_image?.medium_url || "",
        sunlight: Array.isArray(plantData.sunlight) ? plantData.sunlight : [plantData.sunlight],
        watering: plantData.watering || "unknown",
        perenualId: plantData.id
      }
    }
    return {}
  } catch (err) {
    console.error(`❌ Fel vid API-anrop för ${scientificName}:`, err.message)
    return {}
  }
}

const seedCombinedData = async () => {
  console.log("🌱 Startar import av växtdata...")

  try {
    const csvPlants = await readCSVAndCombine()
    console.log(`📊 Läste ${csvPlants.length} växter från CSV`)

    const enrichedPlants = []

    for (const plant of csvPlants) {
      const externalData = await fetchFromExternalAPI(plant.scientificName)

      // Kombinera CSV-data med API-data (API har prioritet)
      enrichedPlants.push({
        scientificName: plant.scientificName,
        swedishName: plant.swedishName,
        description: plant.description,
        companionPlants: plant.companionPlants,
        edibleParts: plant.edibleParts,

        // Använd API-data först, fallback till CSV
        imageUrl: externalData.imageUrl || plant.csvImageUrl || "",
        sunlight: externalData.sunlight || [plant.csvSunlight] || ["unknown"],
        watering: externalData.watering || plant.csvWatering || "unknown",
        perenualId: externalData.perenualId || null,

        // Metadata
        createdAt: new Date(),
        source: "csv_and_api"
      })

      // Vänta lite mellan API-anrop för att inte överbelasta servern
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // Rensa och lägg till ny data
    console.log("🗑️  Rensar befintlig data...")
    await Plant.deleteMany({})

    console.log("💾 Sparar ny data...")
    await Plant.insertMany(enrichedPlants)

    console.log(`✅ ${enrichedPlants.length} växter har importerats och kompletterats med API-data!`)

  } catch (err) {
    console.error("💥 Fel vid seedning:", err.message)
  } finally {
    console.log("🔌 Stänger databasanslutning...")
    mongoose.disconnect()
  }
}

// Kör endast om filen körs direkt (inte importerad)
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCombinedData()
}

export default seedCombinedData