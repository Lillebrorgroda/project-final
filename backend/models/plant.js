import mongoose from "mongoose"


const plantSchema = new mongoose.Schema({
  scientificName: { type: String, required: true },
  swedishName: { type: String, required: true },
  description: String,
  imageUrl: String,
  sunlight: String,
  watering: String,
  companionPlants: [String],
  redListStatus: String
})

const Plant = mongoose.model("Plant", plantSchema)

export default Plant