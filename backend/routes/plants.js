import express from "express"
import Plant from "../models/plant.js"

const plantRouter = express.Router()

// GET all plants
plantRouter.get("/plants", async (req, res) => {
  const { month, companion } = req.query;

  const query = {};

  if (month) {
    query[`calendar.${month}`] = true
  }

  if (companion) {
    query.companions = companion
  }

  try {
    const plants = await Plant.find(query)
    res.json(plants)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get plants",
      error: error.message
    })
  }
})

// POST new plant
plantRouter.post("/plants", async (req, res) => {
  try {
    const newPlant = new Plant(req.body)
    await newPlant.save()
    res.status(201).json(newPlant)
  } catch (error) {
    res.status(400).json({ message: "Failed to add plant", error: error.message })
  }
})

export default plantRouter
