import fs from "fs"
import Papa from "papaparse"
import mongoose from "mongoose"
import Plant from "../models/plant.js"
import axios from "axios"
import dotenv from "dotenv"
import fetch from "node-fetch"
import * as cheerio from "cheerio"

dotenv.config()

// 🔑 Environment variables
const API_KEY = process.env.PERENUAL_API_KEY
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project"

// ⚙️ CSV Reader
const readCSVAndCombine = async () => {
  try {
    const csvContent = fs.readFileSync("data/plants.csv", 'utf-8')

    const csvData = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      delimiter: ';', // CSV uses semicolons
      dynamicTyping: false,
      transformHeader: (header) => header.trim()
    })

    if (csvData.errors.length > 0) {
      console.error('⚠️ CSV parsing errors:', csvData.errors)
    }

    // Map actual CSV columns to the expected format
    const results = csvData.data
      .filter(row => {
        const swedishName = row['Svenskt namn']?.trim()
        return swedishName && swedishName.length > 0 && swedishName !== 'undefined'
      })
      .map(row => ({
        scientificName: row['Vetenskapligt namn']?.trim() || '',
        swedishName: row['Svenskt namn']?.trim() || '',
        description: '',
        companionPlants: [],
        edibleParts: [],
        csvType: row['Typ']?.trim() || '',
        csvBloomingTime: row['Blomningstid']?.trim() || '',
        csvSunlight: row['Sol/Skugga']?.trim() || '',
        csvWatering: row['Vattenbehov']?.trim() || '',
        csvImageUrl: row['Bild_URL']?.trim() || '',
        csvSowingTime: row['Såtid']?.trim() || row['SÃ¥tid']?.trim() || '',
        csvHarvestTime: row['Skördetid']?.trim() || row['SkÃ¶rdetid']?.trim() || '',
        csvRedListStatus: row['Rödlistestatus']?.trim() || row['RÃ¶dlistestatus']?.trim() || ''
      }))

    return results

  } catch (error) {
    console.error('❌ Error reading CSV:', error.message)
    return []
  }
}

// 🖼️ Wikimedia image scraper
const getFirstImageFromCommons = async (categoryUrl) => {
  try {
    const response = await fetch(categoryUrl)
    const html = await response.text()
    const $ = cheerio.load(html)

    const firstFilePage = $(".galleryfilename a").attr("href")
    if (!firstFilePage) return ""

    const filePageUrl = `https://commons.wikimedia.org${firstFilePage}`

    const fileRes = await fetch(filePageUrl);
    const fileHtml = await fileRes.text();
    const $$ = cheerio.load(fileHtml);

    const imgUrl = $$(".fullMedia a").attr("href");
    return imgUrl ? `https:${imgUrl}` : "";
  } catch (error) {
    console.error(`❌ Failed to fetch image for${categoryUrl}`, error);
    return "";
  }
}

// 🌱 Fetch multiple plants from API
const fetchAllPlantsFromAPI = async (maxPages = 30) => {
  try {
    let allAPIPlants = []

    for (let page = 1; page <= maxPages; page++) {

      const response = await axios.get(`https://perenual.com/api/v2/species-list`, {
        params: {
          key: API_KEY,
          page: page
        },
      })

      const plants = response.data.data || []
      allAPIPlants = [...allAPIPlants, ...plants]

      await new Promise(resolve => setTimeout(resolve, 1000))

      // Stop if there is no more pages
      if (!response.data.to || response.data.to >= response.data.total) {
        break
      }
    }

    return allAPIPlants
  } catch (err) {
    console.error("❌ API fetch error:", err.message)
    return []
  }
}

// 🔄 Convert API format to DB format
const convertAPIPlantToOurFormat = (apiPlant) => {
  return {
    scientificName: Array.isArray(apiPlant.scientific_name)
      ? apiPlant.scientific_name[0]
      : apiPlant.scientific_name || "",
    swedishName: apiPlant.common_name || "Okänt svenska namn",
    commonName: apiPlant.common_name || "",
    description: apiPlant.description || "",
    imageUrl: apiPlant.default_image?.medium_url || "",
    sunlight: Array.isArray(apiPlant.sunlight) ? apiPlant.sunlight : [apiPlant.sunlight].filter(Boolean),
    watering: apiPlant.watering ? [apiPlant.watering] : ["unknown"],
    perenualId: apiPlant.id,
    cycle: apiPlant.cycle || "",
    isEdible: false,
    companionPlantNames: [],
    edibleParts: [],
    source: "api",
    createdAt: new Date()
  }
}

// 🔎 Fetch single plant from API
const fetchFromExternalAPI = async (scientificName) => {
  try {
    if (!scientificName || scientificName === 'undefined') {
      return {}
    }

    const response = await axios.get(`https://perenual.com/api/v2/species-list`, {
      params: {
        key: API_KEY,
        q: scientificName,
      },
      timeout: 10000
    })

    const plantData = response.data.data?.[0]
    if (plantData) {
      return {
        imageUrl: plantData.default_image?.medium_url || "",
        sunlight: Array.isArray(plantData.sunlight) ? plantData.sunlight : [plantData.sunlight].filter(Boolean),
        watering: plantData.watering || "unknown",
        perenualId: plantData.id,
        commonName: plantData.common_name
      }
    }
    return {}
  } catch (err) {
    if (err.response?.status === 429) {
      console.error(`⏰ Rate limit reached for ${scientificName}:`, err.response.headers)
      throw err // Re-throw to stop processing
    }
    console.error(`❌ API error for ${scientificName}:`, err.response?.data || err.message)
    return {}
  }
}

// 🌍 Seeder
const seedCombinedData = async () => {
  try {
    await mongoose.connect(mongoUrl)
    await Plant.deleteMany({})

    let allPlantsToSave = []

    // 1. Read CSV and add API-data 
    const csvPlants = await readCSVAndCombine()

    // Add rate limiting and better loop control
    let apiCallsCount = 0
    const MAX_API_CALLS = 90 // Stay under 100 limit

    for (let i = 0; i < csvPlants.length && apiCallsCount < MAX_API_CALLS; i++) {
      const plant = csvPlants[i]

      let externalData = {}

      //  Only make API call if we haven't hit limit
      if (apiCallsCount < MAX_API_CALLS && plant.scientificName) {
        try {
          externalData = await fetchFromExternalAPI(plant.scientificName)
          apiCallsCount++

          // Add delay between API calls
          if (apiCallsCount < MAX_API_CALLS) {
            await new Promise(resolve => setTimeout(resolve, 200))
          }

        } catch (error) {
          if (error.response?.status === 429) {
            console.log('⏰ Rate limit reached, continuing with CSV data only...')
            break // Stop making API calls
          }
        }
      }

      allPlantsToSave.push({
        scientificName: plant.scientificName,
        swedishName: plant.swedishName,
        commonName: externalData.commonName || "",
        description: plant.description || `${plant.csvType} - ${plant.csvBloomingTime}`.trim(),
        companionPlantNames: plant.companionPlants,
        edibleParts: plant.edibleParts,
        isEdible: plant.edibleParts && plant.edibleParts.length > 0,
        imageUrl: externalData.imageUrl || await getFirstImageFromCommons(plant.csvImageUrl) || "",
        sunlight: externalData.sunlight?.length > 0 ? externalData.sunlight : [plant.csvSunlight].filter(Boolean),
        watering: externalData.watering !== "unknown" ? [externalData.watering] : [plant.csvWatering].filter(Boolean),
        perenualId: externalData.perenualId || null,
        type: plant.csvType,
        bloomingTime: plant.csvBloomingTime,
        sowingTime: plant.csvSowingTime,
        harvestTime: plant.csvHarvestTime,
        redListStatus: plant.csvRedListStatus,
        createdAt: new Date(),
        source: "csv"
      })
    }

    // Process remaining CSV plants without API data if hit rate limit
    if (allPlantsToSave.length < csvPlants.length) {

      for (let i = allPlantsToSave.length; i < csvPlants.length; i++) {
        const plant = csvPlants[i]

        allPlantsToSave.push({
          scientificName: plant.scientificName,
          swedishName: plant.swedishName,
          commonName: "",
          description: `${plant.csvType} - ${plant.csvBloomingTime}`.trim(),
          companionPlantNames: plant.companionPlants,
          edibleParts: plant.edibleParts,
          isEdible: plant.edibleParts && plant.edibleParts.length > 0,
          imageUrl: plant.csvImageUrl || "",
          sunlight: [plant.csvSunlight].filter(Boolean),
          watering: [plant.csvWatering].filter(Boolean),
          perenualId: null,
          type: plant.csvType,
          bloomingTime: plant.csvBloomingTime,
          sowingTime: plant.csvSowingTime,
          harvestTime: plant.csvHarvestTime,
          redListStatus: plant.csvRedListStatus,
          createdAt: new Date(),
          source: "csv"
        })
      }
    }

    // 2. Get more plants from API(only if we haven't hit rate limit)
    if (apiCallsCount < MAX_API_CALLS) {
      const apiPlants = await fetchAllPlantsFromAPI(5) // Reduce to 5 pages to stay under rate limit
      const convertedAPIPlants = apiPlants.map(convertAPIPlantToOurFormat)
      // Take away dubblets 
      const existingPerenualIds = new Set(
        allPlantsToSave
          .filter(plant => plant.perenualId)
          .map(plant => plant.perenualId)
      )

      const uniqueAPIPlants = convertedAPIPlants.filter(plant =>
        plant.perenualId && !existingPerenualIds.has(plant.perenualId)
      )

      allPlantsToSave = [...allPlantsToSave, ...uniqueAPIPlants]
    }

    // Save in smaller batches to handle validation errors better
    const savedPlants = []
    const batchSize = 10

    for (let i = 0; i < allPlantsToSave.length; i += batchSize) {
      const batch = allPlantsToSave.slice(i, i + batchSize)

      try {
        const saved = await Plant.insertMany(batch, { ordered: false })
        savedPlants.push(...saved)

      } catch (error) {
        // Try saving individually to see which plants cause issues
        for (const plantData of batch) {
          try {
            const saved = await Plant.create(plantData)
            savedPlants.push(saved)
          } catch (individualError) {
            console.error(`❌ Failed to save ${plantData.swedishName}:`, individualError.message)
          }
        }
      }
    }

    // Show one example
    if (savedPlants.length > 0) {
      console.log("\n📋 Example imported plant:")
      console.log(JSON.stringify(savedPlants[0], null, 2))
    }

  } catch (err) {
    console.error("💥 Seeder error:", err.message)
    console.error(err)
  } finally {
    console.log("🔌 Closing DB connection...")
    mongoose.disconnect()
    process.exit(0)
  }
}


seedCombinedData()