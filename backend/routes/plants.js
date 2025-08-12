import express from "express"
import Plant from "../models/plant.js"
import { authenticationUser } from "./auth.js"

const plantRouter = express.Router()

// GET all plants - med sökning och filtrering
plantRouter.get("/plants", async (req, res) => {
  try {
    const { search, startMonth, endMonth, companion, sunlight, watering } = req.query
    const query = {}

    // Textsökning på namn eller vetenskapligt namn
    if (search) {
      query.$or = [
        { swedishName: { $regex: search, $options: "i" } },
        { scientificName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    }

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

    const plants = await Plant.find(query)

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