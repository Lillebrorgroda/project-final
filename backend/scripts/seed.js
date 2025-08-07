import mongoose from "mongoose"
import Plant from "../models/plant.js"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const seedPlants = async () => {
  await Plant.deleteMany({}) // Rensa befintlig växtdata

  const plants = [
    {
      scientificName: "Solanum lycopersicum",
      swedishName: "Tomat",
      description: "En populär ettårig växt med ätliga frukter.",
      sunlight: "Full sun",
      watering: "Regular",
      imageUrl: "https://example.com/tomato.jpg",
      companionPlants: ["Basilika", "Ringblomma"],
      edibleParts: ["Frukt"],
    },
    {
      scientificName: "Daucus carota",
      swedishName: "Morot",
      description: "Rotfrukt som trivs i sandig jord.",
      sunlight: "Full sun",
      watering: "Moderate",
      imageUrl: "https://example.com/carrot.jpg",
      companionPlants: ["Lök", "Purjolök"],
      edibleParts: ["Rot"],
    },
  ]

  await Plant.insertMany(plants)
  console.log("🌱 Växter seedade!")
  mongoose.disconnect()
}

seedPlants()
