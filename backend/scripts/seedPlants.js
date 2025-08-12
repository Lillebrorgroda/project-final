import fs from "fs"
import csv from "csv-parser"
import mongoose from "mongoose"
import Plant from "../models/plant.js"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const API_KEY = process.env.PERENUAL_API_KEY
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project"

console.log("🚀 Startar seed script...")
console.log("📍 Working directory:", process.cwd())
console.log("🔑 API Key finns:", !!API_KEY)
console.log("🗄️  MongoDB URL:", mongoUrl)

const readCSVAndCombine = async () => {
  const results = []

  return new Promise((resolve, reject) => {
    console.log("📖 Läser CSV-fil...")

    fs.createReadStream("data/plants.csv")
      .pipe(csv())
      .on("data", (data) => {
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
      .on("end", () => {
        console.log(`✅ Läste ${results.length} växter från CSV`)
        resolve(results)
      })
      .on("error", reject)
  })
}

const fetchFromExternalAPI = async (scientificName) => {
  try {
    console.log(`🔍 Hämtar API-data för: ${scientificName}`)

    // FIXAD URL - la till /v2/
    const response = await axios.get(`https://perenual.com/api/v2/species-list`, {
      params: {
        key: API_KEY,
        q: scientificName,
      },
    })

    const plantData = response.data.data?.[0]
    if (plantData) {
      return {
        imageUrl: plantData.default_image?.medium_url || "",
        sunlight: Array.isArray(plantData.sunlight) ? plantData.sunlight : [plantData.sunlight].filter(Boolean),
        watering: plantData.watering || "unknown",
        perenualId: plantData.id,
        commonName: plantData.common_name
      }
    }
    console.log(`⚠️  Ingen data hittades för: ${scientificName}`)
    return {}
  } catch (err) {
    console.error(`❌ Fel vid API-anrop för ${scientificName}:`, err.response?.data || err.message)
    return {}
  }
}

const seedCombinedData = async () => {
  try {
    console.log("🌱 Startar import av växtdata...")

    // Anslut till MongoDB
    await mongoose.connect(mongoUrl)
    console.log("✅ Ansluten till MongoDB")

    const csvPlants = await readCSVAndCombine()
    const enrichedPlants = []

    for (let i = 0; i < csvPlants.length; i++) {
      const plant = csvPlants[i]
      console.log(`📊 Bearbetar växt ${i + 1}/${csvPlants.length}: ${plant.swedishName}`)

      const externalData = await fetchFromExternalAPI(plant.scientificName)

      // Kombinera CSV-data med API-data (API har prioritet)
      enrichedPlants.push({
        scientificName: plant.scientificName,
        swedishName: plant.swedishName,
        commonName: externalData.commonName || "",
        description: plant.description,
        companionPlantNames: plant.companionPlants, // Array med namn
        edibleParts: plant.edibleParts,
        isEdible: plant.edibleParts && plant.edibleParts.length > 0,

        // Använd API-data först, fallback till CSV
        imageUrl: externalData.imageUrl || plant.csvImageUrl || "",
        sunlight: externalData.sunlight?.length > 0 ? externalData.sunlight : [plant.csvSunlight],
        watering: externalData.watering !== "unknown" ? [externalData.watering] : [plant.csvWatering],
        perenualId: externalData.perenualId || null,

        // Metadata
        createdAt: new Date(),
        source: "csv_and_api"
      })

      // Vänta lite mellan API-anrop för att inte överbelasta servern
      if (i < csvPlants.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500)) // 500ms paus
      }
    }

    // Rensa och lägg till ny data
    console.log("🗑️  Rensar befintlig data...")
    await Plant.deleteMany({})

    console.log("💾 Sparar ny data...")
    await Plant.insertMany(enrichedPlants)

    console.log(`🎉 ${enrichedPlants.length} växter har importerats och kompletterats med API-data!`)

    // Visa exempel på första växten
    console.log("\n📋 Exempel på importerad växt:")
    console.log(JSON.stringify(enrichedPlants[0], null, 2))

  } catch (err) {
    console.error("💥 Fel vid seedning:", err.message)
  } finally {
    console.log("🔌 Stänger databasanslutning...")
    mongoose.disconnect()
    process.exit(0) // Säkerställ att processen avslutas
  }
}

// Kör endast om filen körs direkt (inte importerad)
seedCombinedData()