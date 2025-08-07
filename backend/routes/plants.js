import express from "express"
import Plant from "../models/plant.js"

const plantRouter = express.Router()

// GET all plants
plantRouter.get("/plants", async (req, res) => {
  try {
    const plants = await Plant.find()
    res.json(plants)
  } catch (error) {
    res.status(500).json({ message: "Failed to get plants", error: error.message })
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
