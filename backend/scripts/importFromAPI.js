import mongoose from "mongoose"
import Plant from "../models/plant.js"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const API_KEY = process.env.PERENUAL_API_KEY
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project"

// Funktion för att söka växter i API
const searchPlantsInAPI = async (query, page = 1) => {
  try {
    console.log(`🔍 Söker efter: "${query}" (sida ${page})`)

    const response = await axios.get(`https://perenual.com/api/v2/species-list`, {
      params: {
        key: API_KEY,
        q: query,
        page: page
      },
    })

    return response.data
  } catch (err) {
    console.error(`❌ Fel vid sökning av "${query}":`, err.response?.data || err.message)
    return { data: [] }
  }
}

// Funktion för att hämta alla växter från API (utan sökterm)
const getAllPlantsFromAPI = async (maxPages = 10) => {
  try {
    console.log(`🌿 Hämtar växter från API (max ${maxPages} sidor)`)

    let allPlants = []

    for (let page = 1; page <= maxPages; page++) {
      console.log(`📄 Hämtar sida ${page}/${maxPages}`)

      const response = await axios.get(`https://perenual.com/api/v2/species-list`, {
        params: {
          key: API_KEY,
          page: page
        },
      })

      const plants = response.data.data || []
      allPlants = [...allPlants, ...plants]

      console.log(`✅ Hämtade ${plants.length} växter från sida ${page}`)

      // Paus mellan anrop
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Sluta om det inte finns fler sidor
      if (!response.data.to || response.data.to >= response.data.total) {
        console.log("📋 Inga fler sidor att hämta")
        break
      }
    }

    return allPlants
  } catch (err) {
    console.error("❌ Fel vid hämtning av växter:", err.message)
    return []
  }
}

// Konvertera API-data till vårt format
const convertAPIPlantToOurFormat = (apiPlant) => {
  return {
    scientificName: Array.isArray(apiPlant.scientific_name)
      ? apiPlant.scientific_name[0]
      : apiPlant.scientific_name || "",
    swedishName: "", // API har inte svenska namn, kan fyllas i senare
    commonName: apiPlant.common_name || "",
    description: apiPlant.description || "",
    imageUrl: apiPlant.default_image?.medium_url || "",
    sunlight: Array.isArray(apiPlant.sunlight) ? apiPlant.sunlight : [apiPlant.sunlight].filter(Boolean),
    watering: apiPlant.watering ? [apiPlant.watering] : ["unknown"],
    perenualId: apiPlant.id,
    cycle: apiPlant.cycle || "",
    isEdible: false, // Kan inte avgöra från API, sätt manuellt
    source: "api_only",
    createdAt: new Date()
  }
}

// Huvudfunktion för att importera från API
const importFromAPI = async (searchTerms = [], getAllPlants = false, maxPages = 10) => {
  try {
    await mongoose.connect(mongoUrl)
    console.log("✅ Ansluten till MongoDB")

    let allAPIPlants = []

    if (getAllPlants) {
      // Hämta alla växter från API
      allAPIPlants = await getAllPlantsFromAPI(maxPages)
    } else {
      // Sök efter specifika termer
      for (const term of searchTerms) {
        const result = await searchPlantsInAPI(term)
        allAPIPlants = [...allAPIPlants, ...(result.data || [])]

        // Paus mellan sökningar
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log(`📊 Totalt hämtade ${allAPIPlants.length} växter från API`)

    if (allAPIPlants.length === 0) {
      console.log("⚠️  Inga växter hittades")
      return
    }

    // Konvertera till vårt format
    const convertedPlants = allAPIPlants.map(convertAPIPlantToOurFormat)

    // Filtrera bort dubbletter baserat på perenualId
    const uniquePlants = convertedPlants.filter((plant, index, arr) =>
      arr.findIndex(p => p.perenualId === plant.perenualId) === index
    )

    console.log(`🔄 ${uniquePlants.length} unika växter efter dubblettfiltrering`)

    // Spara endast växter som inte redan finns
    let savedCount = 0
    for (const plant of uniquePlants) {
      const existing = await Plant.findOne({ perenualId: plant.perenualId })

      if (!existing) {
        const newPlant = new Plant(plant)
        await newPlant.save()
        savedCount++
      }
    }

    console.log(`💾 Sparade ${savedCount} nya växter (${uniquePlants.length - savedCount} fanns redan)`)

  } catch (err) {
    console.error("💥 Fel vid import:", err.message)
  } finally {
    console.log("🔌 Stänger databasanslutning...")
    mongoose.disconnect()
  }
}

// Olika sätt att använda scriptet:

// 1. Sök efter specifika växter
const searchSpecificPlants = async () => {
  const searchTerms = [
    "tomato",
    "carrot",
    "basil",
    "lettuce",
    "spinach",
    "cucumber",
    "pepper",
    "herbs"
  ]

  await importFromAPI(searchTerms, false)
}

// 2. Hämta alla växter (begränsat antal sidor)
const getAllPlants = async () => {
  await importFromAPI([], true, 10) // Hämta 3 sidor (ca 90 växter)
}

// 3. Sök efter svenska växter (på engelska)
const getSwedishPlants = async () => {
  const swedishPlants = [
    "lingonberry", // Lingon
    "cloudberry",  // Hjortron
    "juniper",     // En
    "birch",       // Björk
    "pine",        // Tall
    "spruce",      // Gran
    "rowan"        // Rönn
  ]

  await importFromAPI(swedishPlants, false)
}

// Kör det du vill:
console.log("🚀 Välj import-metod:")
console.log("1. Specifika söktermer")
console.log("2. Alla växter (begränsat)")
console.log("3. Svenska växter")

// Ändra här för att välja metod:
const method = process.argv[2] || "1"

switch (method) {
  case "1":
    searchSpecificPlants()
    break
  case "2":
    getAllPlants()
    break
  case "3":
    getSwedishPlants()
    break
  default:
    searchSpecificPlants()
}

// Exportera funktioner för användning i andra filer
export { searchPlantsInAPI, importFromAPI, convertAPIPlantToOurFormat }