import express from "express"
import Plant from "../models/plant.js"
import { authenticationUser } from "./auth.js"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const plantRouter = express.Router()
const API_KEY = process.env.PERENUAL_API_KEY

// Funktion för att söka i API som fallback
const searchPlantInAPI = async (searchTerm) => {
  try {
    console.log(`🔍 Söker i API efter: "${searchTerm}"`)

    const response = await axios.get(`https://perenual.com/api/v2/species-list`, {
      params: {
        key: API_KEY,
        q: searchTerm,
      },
    })

    const apiPlants = response.data.data || []
    console.log(`📦 API returnerade ${apiPlants.length} resultat`)

    // Konvertera API-resultat till vårt format
    return apiPlants.map(apiPlant => ({
      _id: `api_${apiPlant.id}`, // Temp ID för frontend
      scientificName: Array.isArray(apiPlant.scientific_name)
        ? apiPlant.scientific_name[0]
        : apiPlant.scientific_name || "",
      swedishName: apiPlant.common_name || "Okänt svenska namn",
      commonName: apiPlant.common_name || "",
      description: apiPlant.description || "",
      imageUrl: apiPlant.default_image?.medium_url || "",
      sunlight: Array.isArray(apiPlant.sunlight) ? apiPlant.sunlight : [apiPlant.sunlight].filter(Boolean),
      watering: apiPlant.watering ? [apiPlant.watering] : ["unknown"],
      perenualId: apiPlant.id,
      cycle: apiPlant.cycle || "",
      isEdible: false,
      companionPlantNames: [],
      edibleParts: [],
      source: "api_live", // Markera som live API-resultat
      isFromAPI: true, // Extra flagga för frontend
      createdAt: new Date()
    }))
  } catch (error) {
    console.error(`❌ API-sökning misslyckades för "${searchTerm}":`, error.message)
    return []
  }
}

// Funktion för att spara API-resultat till databas (valfritt)
const saveAPIPlantToDatabase = async (apiPlant) => {
  try {
    // Kolla om växten redan finns
    const existingPlant = await Plant.findOne({ perenualId: apiPlant.perenualId })

    if (!existingPlant) {
      const plantData = {
        scientificName: apiPlant.scientificName,
        swedishName: apiPlant.commonName || "Okänt svenska namn",
        commonName: apiPlant.commonName,
        description: apiPlant.description,
        imageUrl: apiPlant.imageUrl,
        sunlight: apiPlant.sunlight,
        watering: apiPlant.watering,
        perenualId: apiPlant.perenualId,
        cycle: apiPlant.cycle,
        isEdible: false,
        companionPlantNames: [],
        edibleParts: [],
        source: "api",
        createdAt: new Date()
      }

      const newPlant = new Plant(plantData)
      await newPlant.save()
      console.log(`💾 Sparade ny växt från API: ${plantData.commonName}`)
      return newPlant
    }

    return existingPlant
  } catch (error) {
    console.error(`❌ Kunde inte spara API-växt:`, error.message)
    return null
  }
}

// GET all plants - med sökning, filtrering OCH API-fallback
plantRouter.get("/plants", async (req, res) => {
  try {
    const { search, startMonth, endMonth, companion, sunlight, watering, includeAPI } = req.query
    const query = {}

    console.log("🔍 Inkommande query params", req.query)

    // Textsökning på namn eller vetenskapligt namn
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" }

      query.$or = [
        { scientificName: searchRegex },
        { swedishName: searchRegex },
        { commonName: searchRegex },
        { description: searchRegex }
      ]
    }

    // AKTIVERADE FILTER (tidigare kommenterade)

    // Filtrering efter månad
    if (startMonth && endMonth) {
      const start = Number(startMonth)
      const end = Number(endMonth)

      if (start <= end) {
        // Normal period, t.ex. 3–5
        query.sowingMonths = { $gte: start, $lte: end }
      } else {
        // Om perioden går över årsskiftet, t.ex. 11–2
        query.$or = query.$or ? [...query.$or,
        { sowingMonths: { $gte: start } },
        { sowingMonths: { $lte: end } }
        ] : [
          { sowingMonths: { $gte: start } },
          { sowingMonths: { $lte: end } }
        ]
      }
    }

    // Filtrering efter kompanjonväxter
    if (companion) {
      query.companionPlantNames = { $in: [companion] }
    }

    // Filtrering efter ljusbehov
    if (sunlight) {
      query.sunlight = { $in: [sunlight] }
    }

    // Filtrering efter vattningsbehov
    if (watering) {
      query.watering = { $in: [watering] }
    }

    console.log("📊 Filter som skickas till MongoDB:", JSON.stringify(query, null, 2))

    // Sök i databasen först
    const plants = await Plant.find(query).limit(50)
    console.log(`📊 Antal träffar i databas: ${plants.length}`)

    let allResults = plants
    let apiResults = []

    // Om inga resultat i databas OCH det finns en sökterm, sök i API
    if (plants.length === 0 && search && search.trim() && includeAPI !== 'false') {
      console.log("🌐 Inga resultat i databas, söker i API som fallback...")
      apiResults = await searchPlantInAPI(search.trim())

      if (apiResults.length > 0) {
        console.log(`✨ Hittade ${apiResults.length} resultat i API`)
        allResults = [...plants, ...apiResults]
      }
    }

    // Debug om inga träffar alls
    if (allResults.length === 0) {
      console.log("⚠️ Inga träffar hittades varken i databas eller API.")

      // Debug: Visa vad som finns i databasen
      const totalCount = await Plant.countDocuments({})
      console.log(`📢 Totalt antal växter i databasen: ${totalCount}`)

      if (totalCount > 0) {
        const sample = await Plant.findOne().lean()
        console.log("🔍 Exempel på växt i databasen:", {
          scientificName: sample?.scientificName,
          swedishName: sample?.swedishName,
          sunlight: sample?.sunlight,
          watering: sample?.watering
        })
      }
    }

    res.json({
      success: true,
      count: allResults.length,
      dbCount: plants.length,
      apiCount: apiResults.length,
      plants: allResults,
      searchedInAPI: apiResults.length > 0, // Info för frontend
      searchTerm: search || null
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get plants",
      error: error.message
    })
  }
})

// Spara växt till användarens sparade växter
plantRouter.post("/plants/save", authenticationUser, async (req, res) => {
  try {
    const { plantId, notes } = req.body
    if (!plantId) {
      return res.status(400).json({
        success: false,
        message: "Plant ID is required"
      })
    }
    const plant = await Plant.findById(plantId)
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found"
      })
    }
    // Lägg till i användarens sparade växter
    const user = req.user
    const savedPlant = {
      plant: plant._id,
      savedAt: new Date(),
      notes: notes || ""
    }
    user.savedPlants.push(savedPlant)
    await user.save()
    res.status(201).json({
      success: true,
      message: "Plant saved successfully",
      savedPlant
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save plant",
      error: error.message
    })
  }
})

// NY ENDPOINT: Spara API-växt till databas
plantRouter.post("/plants/save-from-api", authenticationUser, async (req, res) => {
  try {
    const { apiPlant } = req.body

    if (!apiPlant || !apiPlant.perenualId) {
      return res.status(400).json({
        success: false,
        message: "API plant data required"
      })
    }

    const savedPlant = await saveAPIPlantToDatabase(apiPlant)

    if (savedPlant) {
      res.status(201).json({
        success: true,
        message: "Plant saved from API to database",
        plant: savedPlant
      })
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to save plant from API"
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save API plant",
      error: error.message
    })
  }
})

// Debug endpoint - visa alla unika värden för filtrering
plantRouter.get("/plants-debug", async (req, res) => {
  try {
    const uniqueSunlight = await Plant.distinct("sunlight")
    const uniqueWatering = await Plant.distinct("watering")
    const uniqueCompanions = await Plant.distinct("companionPlantNames")
    const samplePlants = await Plant.find({}).limit(5).lean()

    res.json({
      success: true,
      debug: {
        totalCount: await Plant.countDocuments({}),
        uniqueSunlight,
        uniqueWatering,
        uniqueCompanions,
        samplePlants: samplePlants.map(p => ({
          scientificName: p.scientificName,
          swedishName: p.swedishName,
          sunlight: p.sunlight,
          watering: p.watering,
          companionPlantNames: p.companionPlantNames
        }))
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Debug failed",
      error: error.message
    })
  }
})

// GET specific plant by ID
plantRouter.get("/plants/:id", async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id)

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found"
      })
    }

    res.json({
      success: true,
      plant: plant
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get plant",
      error: error.message
    })
  }
})

// POST new plant (endast för inloggade användare)
plantRouter.post("/plants", authenticationUser, async (req, res) => {
  try {
    const plantData = {
      ...req.body,
      createdBy: req.user._id,
      createdAt: new Date()
    }

    const newPlant = new Plant(plantData)
    await newPlant.save()

    res.status(201).json({
      success: true,
      message: "Plant created successfully",
      plant: newPlant
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to add plant",
      error: error.message
    })
  }
})

// PUT update plant (endast för inloggade användare)
plantRouter.put("/plants/:id", authenticationUser, async (req, res) => {
  try {
    const updatedPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!updatedPlant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found"
      })
    }

    res.json({
      success: true,
      message: "Plant updated successfully",
      plant: updatedPlant
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update plant",
      error: error.message
    })
  }
})

// DELETE plant (endast för inloggade användare)
plantRouter.delete("/plants/:id", authenticationUser, async (req, res) => {
  try {
    const deletedPlant = await Plant.findByIdAndDelete(req.params.id)

    if (!deletedPlant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found"
      })
    }

    res.json({
      success: true,
      message: "Plant deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete plant",
      error: error.message
    })
  }
})

export default plantRouter