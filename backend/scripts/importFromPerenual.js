// scripts/importFromPerenual.js
import fetch from "node-fetch"
import mongoose from "mongoose"
import Plant from "../models/plant.js"

mongoose.connect("mongodb://localhost/final-project")

const PERENUAL_API = "https://perenual.com/api/species-list?key=sk-8lie6894881b3446c11733"

const fetchPlants = async () => {
  const res = await fetch(PERENUAL_API)
  const data = await res.json()

  for (const plant of data.data) {
    const newPlant = new Plant({
      scientificName: plant.scientific_name,
      swedishName: "", // du kan lägga till översättning senare
      description: plant.description,
      sunlight: plant.sunlight,
    })
    await newPlant.save()
  }

  mongoose.disconnect()
}

fetchPlants()
