import fs from "fs"
import csv from "csv-parser"
import mongoose from "mongoose"
import Plant from "../models/plant.js"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const results = []

fs.createReadStream("data/plants.csv")
  .pipe(csv())
  .on("data", (data) => {
    results.push({
      scientificName: data.scientificName,
      swedishName: data.swedishName,
      description: data.description,
      sunlight: data.sunlight,
      watering: data.watering,
      imageUrl: data.imageUrl,
      companionPlants: data.companionPlants ? data.companionPlants.split(";") : [],
      edibleParts: data.edibleParts ? data.edibleParts.split(";") : [],
    })
  })
  .on("end", async () => {
    try {
      await Plant.deleteMany({})
      await Plant.insertMany(results)
      console.log("🌿 Växter importerade från CSV!")
    } catch (err) {
      console.error("❌ Fel vid import:", err)
    } finally {
      mongoose.disconnect()
    }
  })
