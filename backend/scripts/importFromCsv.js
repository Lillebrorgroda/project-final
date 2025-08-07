// scripts/importFromCsv.js
import fs from "fs"
import csv from "csv-parser"
import mongoose from "mongoose"
import Plant from "../models/plant.js"

mongoose.connect("mongodb://localhost/final-project")

fs.createReadStream("data/plants.csv")
  .pipe(csv())
  .on("data", async (row) => {
    const plant = new Plant({
      scientificName: row.scientificName,
      swedishName: row.swedishName,
      description: row.description,
      sunlight: row.sunlight,
    })
    await plant.save()
  })
  .on("end", () => {
    console.log("CSV-import done")
    mongoose.disconnect()
  })
