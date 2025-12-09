import express from "express"
import Plant from "../models/plant.js"
import { authenticationUser } from "./auth.js"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const plantRouter = express.Router()
const API_KEY = process.env.PERENUAL_API_KEY

// Function to search in API as fallback
const searchPlantInAPI = async (searchTerm) => {
  try {
    const response = await axios.get(`https://perenual.com/api/v2/species-list`, {
      params: {
        key: API_KEY,
        q: searchTerm,
      },
      timeout: 10000 // Add timeout
    })

    const apiPlants = response.data.data || []

    // Convert API results to our format
    return apiPlants.map(apiPlant => ({
      _id: `api_${apiPlant.id}`, // Temp ID for frontend
      scientificName: Array.isArray(apiPlant.scientific_name)
        ? apiPlant.scientific_name[0]
        : apiPlant.scientific_name || "",
      swedishName: apiPlant.common_name || "Unknown Swedish name",
      commonName: apiPlant.common_name || "",
      description: apiPlant.description || "",
      imageUrl: apiPlant.default_image?.medium_url || "",
      sunlight: Array.isArray(apiPlant.sunlight)
        ? apiPlant.sunlight
        : [apiPlant.sunlight].filter(Boolean),
      watering: apiPlant.watering ? [apiPlant.watering] : ["unknown"],
      perenualId: apiPlant.id,
      cycle: apiPlant.cycle || "",
      isEdible: false,
      companionPlantNames: [],
      edibleParts: [],
      source: "api_live", // Mark as live API result
      isFromAPI: true, // Extra flag for frontend
      createdAt: new Date()
    }))
  } catch (error) {
    console.error(`❌ API search failed for "${searchTerm}":`, error.message)
    return []
  }
}


// GET all plants - with search, filtering AND API fallback
plantRouter.get("/plants", async (req, res) => {
  try {
    const { search, startMonth, endMonth, companion, sunlight, watering, includeAPI } = req.query
    const query = {}

    // Text search on name or scientific name
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" }

      query.$or = [
        { scientificName: searchRegex },
        { swedishName: searchRegex },
        { commonName: searchRegex },
        { description: searchRegex }
      ]
    }

    // Month filtering
    if (startMonth && endMonth) {
      const start = Number(startMonth)
      const end = Number(endMonth)

      if (start <= end) {
        // Normal period, e.g. 3–5
        query.sowingMonths = { $gte: start, $lte: end }
      } else {
        // If period spans year end, e.g. 11–2
        query.$or = query.$or ? [...query.$or,
        { sowingMonths: { $gte: start } },
        { sowingMonths: { $lte: end } }
        ] : [
          { sowingMonths: { $gte: start } },
          { sowingMonths: { $lte: end } }
        ]
      }
    }

    // Companion plants filtering
    if (companion) {
      query.companionPlantNames = { $in: [companion] }
    }

    // Sunlight filtering
    if (sunlight) {
      query.sunlight = { $in: [sunlight] }
    }

    // Watering filtering
    if (watering) {
      query.watering = { $in: [watering] }
    }

    // Search database first
    const plants = await Plant.find(query).limit(50)

    let allResults = plants
    let apiResults = []

    // If no database results AND there's a search term, search API
    if (plants.length === 0 && search && search.trim() && includeAPI !== 'false') {
      apiResults = await searchPlantInAPI(search.trim())

      if (apiResults.length > 0) {
        allResults = [...plants, ...apiResults]
      }
    }

    // Debug if no hits at all
    if (allResults.length === 0) {

      console.error("⚠️ No hits found in either database or API.")

      // Debug: Show what's in the database
      const totalCount = await Plant.countDocuments({})

      if (totalCount > 0) {
        const sample = await Plant.findOne().lean()
        return {
          scientificName: sample?.scientificName,
          swedishName: sample?.swedishName,
          sunlight: sample?.sunlight,
          watering: sample?.watering
        }
      }
    }

    res.json({
      success: true,
      count: allResults.length,
      dbCount: plants.length,
      apiCount: apiResults.length,
      plants: allResults,
      searchedInAPI: apiResults.length > 0, // Info for frontend
      searchTerm: search || null
    })
  } catch (error) {
    console.error("❌ Error in GET /plants:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get plants",
      error: error.message
    })
  }
})

// Save plant to user's saved plants
plantRouter.post("/plants/saved", authenticationUser, async (req, res) => {
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

    // Add to user's saved plants
    const user = req.user
    const alreadySaved = user.savedPlants.some(
      (p) => p.plant.toString() === plantId
    )

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Plant already saved"
      })
    }

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
    console.error("❌ Error saving plant:", error)
    res.status(500).json({
      success: false,
      message: "Failed to save plant",
      error: error.message
    })
  }
})



// Save API plant to database AND add to favorites
plantRouter.post("/plants/save-and-favorite", authenticationUser, async (req, res) => {
  try {
    const { apiPlant, notes } = req.body

    if (!apiPlant || !apiPlant.perenualId) {
      return res.status(400).json({
        success: false,
        message: "API plant data required"
      })
    }

    // Find or create plant in database
    let savedPlant = await Plant.findOne({ perenualId: apiPlant.perenualId })
    if (!savedPlant) {
      // Remove temporary fields before saving
      const { _id, isFromAPI, source, ...plantDataToSave } = apiPlant
      plantDataToSave.source = "api" // Set proper source

      savedPlant = new Plant(plantDataToSave)
      await savedPlant.save()
    }

    const user = req.user
    // Fixed typo: savedPlant -> savedPlants
    const alreadySaved = user.savedPlants.some(
      (p) => p.plant.toString() === savedPlant._id.toString()
    )

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Plant already saved"
      })
    }

    const savedPlantEntry = {
      plant: savedPlant._id,
      savedAt: new Date(),
      notes: notes || ""
    }

    user.savedPlants.push(savedPlantEntry)
    await user.save()

    res.status(201).json({
      success: true,
      message: "Plant saved to database and favorites",
      plant: savedPlant,
      savedPlant: savedPlantEntry
    })

  } catch (error) {
    console.error("❌ Error in save-and-favorite:", error)
    res.status(500).json({
      success: false,
      message: "Failed to save plant",
      error: error.message
    })
  }
})



// GET user's saved plants
plantRouter.get("/plants/saved", authenticationUser, async (req, res) => {
  try {
    const user = req.user
    await user.populate("savedPlants.plant")

    res.status(200).json({
      success: true,
      savedPlants: user.savedPlants.map(sp => ({
        _id: sp._id,
        savedAt: sp.savedAt,
        notes: sp.notes,
        plant: sp.plant
      }))
    })
  } catch (error) {
    console.error("❌ Error getting saved plants:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get saved plants",
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
    console.error("❌ Error getting plant by ID:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get plant",
      error: error.message
    })
  }
})

// POST new plant (only for logged in users)
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
    console.error("❌ Error creating plant:", error)
    res.status(400).json({
      success: false,
      message: "Failed to add plant",
      error: error.message
    })
  }
})

// PUT update plant (only for logged in users)
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
    console.error("❌ Error updating plant:", error)
    res.status(400).json({
      success: false,
      message: "Failed to update plant",
      error: error.message
    })
  }
})

// DELETE plant (only for logged in users)
plantRouter.delete("/plants/saved/:savedPlantId", authenticationUser, async (req, res) => {
  try {
    const { savedPlantId } = req.params
    const user = req.user


    // Find the saved plant entry
    const index = user.savedPlants.findIndex(
      (p) => p._id.toString() === savedPlantId
    )

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Saved plant not found"
      })
    }

    // Remove it from the array
    const removed = user.savedPlants.splice(index, 1)
    await user.save()

    res.status(200).json({
      success: true,
      message: "Saved plant removed successfully",
      removed: removed[0]
    })
  } catch (error) {
    console.error("❌ Error removing saved plant:", error)
    res.status(500).json({
      success: false,
      message: "Failed to remove saved plant",
      error: error.message
    })
  }

})

export default plantRouter