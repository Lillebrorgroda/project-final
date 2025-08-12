import mongoose from "mongoose";
import Plant from "./models/plant.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.PERENUAL_API_KEY;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost/final-project";

if (!API_KEY) {
  console.error("❌ Ingen API-nyckel hittades i .env (PERENUAL_API_KEY)");
  process.exit(1);
}

await mongoose.connect(MONGO_URL);
console.log("✅ Ansluten till MongoDB");

const fetchFromPerenual = async (page = 1) => {
  try {
    console.log(`🔍 Hämtar växter från API (sida ${page})...`);

    const response = await axios.get(`https://perenual.com/api/v2/species-list`, {
      params: {
        key: API_KEY,
        page: page
      },
    });

    console.log("📡 API-svar:", response.data); // DEBUG: Visa hela svaret

    if (!Array.isArray(response.data.data)) {
      console.error("❌ API returnerar inte en lista i 'data'");
      return [];
    }

    return response.data.data.map(plantData => ({
      scientificName: Array.isArray(plantData.scientific_name)
        ? plantData.scientific_name
        : [plantData.scientific_name || ""],
      commonName: plantData.common_name || "",
      description: plantData.description || "",
      companionPlants: [],
      edibleParts: [],
      imageUrl: plantData.default_image?.medium_url || "",
      sunlight: Array.isArray(plantData.sunlight)
        ? plantData.sunlight
        : [plantData.sunlight || "unknown"],
      watering: plantData.watering || "unknown",
      perenualId: plantData.id || null,
      createdAt: new Date(),
      source: "api-test"
    }));
  } catch (err) {
    console.error(`❌ Fel vid API-anrop:`, err.message);
    return [];
  }
};

const seedAPIPlantsTest = async () => {
  console.log("🌱 Startar API-import av växtdata...");

  try {
    let page = 1;
    let allPlants = [];

    while (page <= 1) { // bara första sidan för test
      const plants = await fetchFromPerenual(page);
      if (plants.length === 0) {
        console.error("⚠️ Inga växter hämtades — avbryter seedning");
        break;
      }
      allPlants = allPlants.concat(plants);
      page++;
    }

    if (allPlants.length > 0) {
      console.log(`🗑️  Rensar befintlig testdata...`);
      await Plant.deleteMany({ source: "api-test" });

      console.log(`💾 Sparar ${allPlants.length} växter (API-test)...`);
      await Plant.insertMany(allPlants);

      console.log(`✅ ${allPlants.length} växter har importerats och sparats i test!`);
    }
  } catch (err) {
    console.error("💥 Fel vid seedning:", err.message);
  } finally {
    console.log("🔌 Stänger databasanslutning...");
    await mongoose.disconnect();
  }
};


export default seedAPIPlantsTest;