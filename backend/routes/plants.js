import express from "express"
import Plant from "../models/plant.js"
import { authenticationUser } from "./auth.js"

const plantRouter = express.Router()

// GET all plants - med sökning och filtrering
plantRouter.get("/plants", async (req, res) => {
  try {
    const { search, startMonth, endMonth, companion, sunlight, watering } = req.query
    const query = {}

    console.log("🔍 Inkommande query params", req.query)

    // Textsökning på namn eller vetenskapligt namn
    if (search && search.trim()) {
      const serchRegex = { $regex: search.trim(), $options: "i" }

      query.$or = [
        { scientificName: serchRegex },
        { swedishName: serchRegex },
        { commonName: serchRegex },
        { description: serchRegex }
      ]
    }
    /**
        // Filtrering efter månad (om du har sådan data)
        if (startMonth && endMonth) {
          const start = Number(startMonth)
          const end = Number(endMonth)
    
          if (start <= end) {
            // Normal period, t.ex. 3–5
            query.sowingMonths = { $gte: start, $lte: end }
          } else {
            // Om perioden går över årsskiftet, t.ex. 11–2
            query.$or = [
              { sowingMonths: { $gte: start } },
              { sowingMonths: { $lte: end } }
            ]
          }
        }
    
        // Filtrering efter kompanjonväxter
        if (companion) {
          query.companionPlants = { $in: [companion] }
        }
    
        // Filtrering efter ljusbehov
        if (sunlight) {
          query.sunlight = { $in: [sunlight] }
        }
    
        // Filtrering efter vattningsbehov
        if (watering) {
          query.watering = watering
        }
     */
    console.log("🔍 Filter som skickas till MongoDB:", query)

    console.log("📊 Filter som skickas till MongoDB:", JSON.stringify(query, null, 2))


    const plants = await Plant.find(query).limit(50)

    console.log(`📊 Antal träffar: ${plants.length}`)
    if (plants.length > 0) {
      console.log("📌 Första träffen:", {
        scientificName: plants[0].scientificName,
        swedishName: plants[0].swedishName,
        sunlight: plants[0].sunlight,
        watering: plants[0].watering
      })
    } else {
      console.log("⚠️ Inga träffar hittades.")

      // Debug: Visa vad som finns i databasen
      const totalCount = await Plant.countDocuments({})
      console.log(`🔢 Totalt antal växter i databasen: ${totalCount}`)

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
      count: plants.length,
      plants: plants
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get plants",
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
      createdBy: req.user._id, // Lägg till vem som skapade växten
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