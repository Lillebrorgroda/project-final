// scripts/testPerenual.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.PERENUAL_API_KEY;

if (!API_KEY) {
  console.error("❌ Ingen API-nyckel hittades i .env (PERENUAL_API_KEY)");
  process.exit(1);
}

const fetchFromPerenual = async (page = 1) => {
  try {
    console.log(`🔍 Hämtar växter från API, sida ${page}...`);

    const response = await axios.get(`https://perenual.com/api/species-list`, {
      params: {
        key: API_KEY,
        page: page
      },
    });

    if (!Array.isArray(response.data.data)) {
      console.error("❌ API svarar inte med en lista:", response.data);
      return [];
    }

    return response.data.data;
  } catch (err) {
    console.error(`❌ Fel vid API-anrop:`, err.message);
    return [];
  }
};

const runTest = async () => {
  let page = 1;
  let allPlants = [];

  while (page <= 2) { // testa bara 2 sidor för att spara tid
    const plants = await fetchFromPerenual(page);
    allPlants = allPlants.concat(plants);
    page++;
  }

  console.log(`✅ Totalt hämtade växter: ${allPlants.length}`);
  console.log("📋 Exempel på växtdata:", allPlants[0]); // visa första växten
};

runTest();
