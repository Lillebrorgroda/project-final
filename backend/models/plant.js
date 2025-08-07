import mongoose from "mongoose";

const plantSchema = new mongoose.Schema({
  scientificName: {
    type: String,
    required: true,
  },
  commonName: {
    type: String,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  watering: {
    type: [String],
    default: [],
  },
  sunlight: {
    type: [String],
    default: [],
  },
  soil: {
    type: [String],
    default: [],
  },
  sowingPeriod: {
    type: [String], // Ex: ["March", "April"]
    default: [],
  },
  harvestPeriod: {
    type: [String],
    default: [],
  },
  companions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plant",
  }],
  isEdible: {
    type: Boolean,
    default: false,
  },
  redListStatus: {
    type: String, // Ex: "LC", "NT", "EN", "CR", etc.
  },
  tags: {
    type: [String], // Ex: ["indoors", "perennial", "climber"]
    default: [],
  },
});

const Plant = mongoose.model("Plant", plantSchema);

export default Plant;
