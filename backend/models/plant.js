import mongoose from "mongoose";

const plantSchema = new mongoose.Schema({

  scientificName: {
    type: [String],
    required: true,
  },
  swedishName: {
    type: String,
  },
  commonName: {
    type: String, // for the english name
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
  sowingMonths: {
    type: [Number], // Ex: [3, 4, 5] för mars-maj
    default: [],
  },
  harvestMonths: {
    type: [Number],
    default: [],
  },
  companionPlants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plant",
  }],
  companionPlantNames: {
    type: [String],
    default: [],
  },
  edibleParts: {
    type: [String], // Ex: ["leaves", "fruit", "root"]
    default: [],
  },
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

  // API-data
  perenualId: {
    type: Number, // ID from Perenual API
  },
  source: {
    type: String,
    enum: ["csv", "api", "csv_and_api", "manual"],
    default: "manual",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Index
plantSchema.index({ scientificName: 1 });
plantSchema.index({ swedishName: 1 });
plantSchema.index({ commonName: 1 });
plantSchema.index({ sunlight: 1 });
plantSchema.index({ watering: 1 });
plantSchema.index({ sowingMonths: 1 });


plantSchema.virtual('fullName').get(function () {
  return `${this.swedishName} (${this.scientificName})`;
});

// Middleware for updatedAt
plantSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

const Plant = mongoose.model("Plant", plantSchema);

export default Plant;