import fs from "fs"
// Replace csv-parser with Papa Parse for better control
import Papa from "papaparse"
import mongoose from "mongoose"
import Plant from "../models/plant.js"
import axios from "axios"
import dotenv from "dotenv"
import fetch from "node-fetch"
import * as cheerio from "cheerio"

dotenv.config()

const API_KEY = process.env.PERENUAL_API_KEY
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project"

console.log("🚀 Startar seed script...")
console.log("📁 Working directory:", process.cwd())
console.log("🔑 API Key finns:", !!API_KEY)
console.log("🗄️ MongoDB URL:", mongoUrl)

// CHANGE: Complete rewrite of CSV reading function to handle your actual CSV structure
const readCSVAndCombine = async () => {
  try {
    console.log("📖 Läser CSV-fil...")

    // CHANGE: Read file with proper encoding and use Papa Parse
    const csvContent = fs.readFileSync("data/plants.csv", 'utf-8')

    const csvData = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      delimiter: ';', // CHANGE: Your CSV uses semicolons
      dynamicTyping: false,
      transformHeader: (header) => header.trim() // CHANGE: Clean headers
    })

    // CHANGE: Add debugging info
    console.log('📋 CSV Headers:', Object.keys(csvData.data[0] || {}))
    console.log('📋 First row sample:', csvData.data[0])

    if (csvData.errors.length > 0) {
      console.log('⚠️ CSV parsing errors:', csvData.errors)
    }

    // CHANGE: Map your actual CSV columns to the expected format
    const results = csvData.data
      .filter(row => {
        const swedishName = row['Svenskt namn']?.trim()
        return swedishName && swedishName.length > 0 && swedishName !== 'undefined'
      })
      .map(row => ({
        // CHANGE: Map actual CSV columns
        scientificName: row['Vetenskapligt namn']?.trim() || '',
        swedishName: row['Svenskt namn']?.trim() || '',
        description: '', // Not in your CSV
        companionPlants: [], // Not in your CSV
        edibleParts: [], // Not in your CSV
        // CHANGE: Use actual CSV data as fallback
        csvType: row['Typ']?.trim() || '',
        csvBloomingTime: row['Blomningstid']?.trim() || '',
        csvSunlight: row['Sol/Skugga']?.trim() || '',
        csvWatering: row['Vattenbehov']?.trim() || '',
        csvImageUrl: row['Bild_URL']?.trim() || '',
        csvSowingTime: row['Såtid']?.trim() || row['SÃ¥tid']?.trim() || '',
        csvHarvestTime: row['Skördetid']?.trim() || row['SkÃ¶rdetid']?.trim() || '',
        csvRedListStatus: row['Rödlistestatus']?.trim() || row['RÃ¶dlistestatus']?.trim() || ''
      }))

    console.log(`✅ Läste ${results.length} växter från CSV`)
    return results

  } catch (error) {
    console.error('❌ Error reading CSV:', error.message)
    return []
  }
}

// Handle picture URLs
const getFirstImageFromCommons = async (categoryUrl) => {
  try {
    const response = await fetch(categoryUrl)
    const html = await response.text()
    const $ = cheerio.load(html)

    const firstFilePage = $(".galleryfilename a").attr("href")
    if (!firstFilePage) {
      console.log(`⚠️ Ingen bild hittades för kategori: ${categoryUrl}`)
      return ""
    }
    const filePageUrl = `https://commons.wikimedia.org${firstFilePage}`

    const fileRes = await fetch(filePageUrl);
    const fileHtml = await fileRes.text();
    const $$ = cheerio.load(fileHtml);

    const imgUrl = $$(".fullMedia a").attr("href");
    return imgUrl ? `https:${imgUrl}` : "";
  } catch (error) {
    console.error(`Kunde inte hämta bild från ${categoryUrl}`, error);
    return "";
  }
}

// HÃ¤mta mÃ¥nga vÃ¤xter frÃ¥n API (alla sidor)
const fetchAllPlantsFromAPI = async (maxPages = 30) => {
  try {
    console.log(`🌿 Hämtar växter från API (max ${maxPages} sidor)`)
    let allAPIPlants = []

    for (let page = 1; page <= maxPages; page++) {
      console.log(`📄 Hämtar sida ${page}/${maxPages}`)

      const response = await axios.get(`https://perenual.com/api/v2/species-list`, {
        params: {
          key: API_KEY,
          page: page
        },
      })

      const plants = response.data.data || []
      allAPIPlants = [...allAPIPlants, ...plants]

      console.log(`✅ Hämtade ${plants.length} växter från sida ${page}`)

      // Paus mellan anrop fÃ¶r att inte Ã¶verbelasta API:et
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Sluta om det inte finns fler sidor
      if (!response.data.to || response.data.to >= response.data.total) {
        console.log("📋 Inga fler sidor att hämta")
        break
      }
    }

    return allAPIPlants
  } catch (err) {
    console.error("❌ Fel vid hämtning av växter från API:", err.message)
    return []
  }
}

// Konvertera API-vÃ¤xt till vÃ¥rt format
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

// CHANGE: Add rate limiting and better error handling
const fetchFromExternalAPI = async (scientificName) => {
  try {
    // CHANGE: Skip if no scientific name
    if (!scientificName || scientificName === 'undefined') {
      console.log(`⚠️ Hoppar över tomt vetenskapligt namn`)
      return {}
    }

    console.log(`🔍 Hämtar API-data för: ${scientificName}`)

    const response = await axios.get(`https://perenual.com/api/v2/species-list`, {
      params: {
        key: API_KEY,
        q: scientificName,
      },
      timeout: 10000 // CHANGE: Add timeout
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
    console.log(`⚠️ Ingen data hittades för: ${scientificName}`)
    return {}
  } catch (err) {
    // CHANGE: Better error handling for rate limits
    if (err.response?.status === 429) {
      console.error(`❌ Rate limit nådd för ${scientificName}:`, err.response.headers)
      throw err // Re-throw to stop processing
    }
    console.error(`❌ Fel vid API-anrop för ${scientificName}:`, err.response?.data || err.message)
    return {}
  }
}

const seedCombinedData = async () => {
  try {
    console.log("🌱 Startar import av växtdata...")

    // Anslut till MongoDB
    await mongoose.connect(mongoUrl)
    console.log("✅ Ansluten till MongoDB")

    // Rensa befintlig data
    console.log("🗑️ Rensar befintlig data...")
    await Plant.deleteMany({})

    let allPlantsToSave = []

    // 1. FÃ¶rst: LÃ¤s CSV och berika med specifik API-data
    const csvPlants = await readCSVAndCombine()
    console.log("📊 Bearbetar CSV-växter med specifik API-data...")

    // Add rate limiting and better loop control
    let apiCallsCount = 0
    const MAX_API_CALLS = 90 // Stay under 100 limit

    for (let i = 0; i < csvPlants.length && apiCallsCount < MAX_API_CALLS; i++) {
      const plant = csvPlants[i]
      console.log(`📄 Bearbetar CSV-växt ${i + 1}/${csvPlants.length}: ${plant.swedishName}`)

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

      // Better data mapping with CSV fallbacks
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
        // CHANGE: Add CSV-specific fields
        type: plant.csvType,
        bloomingTime: plant.csvBloomingTime,
        sowingTime: plant.csvSowingTime,
        harvestTime: plant.csvHarvestTime,
        redListStatus: plant.csvRedListStatus,
        createdAt: new Date(),
        source: "csv"
      })
    }

    // Process remaining CSV plants without API data if we hit rate limit
    if (allPlantsToSave.length < csvPlants.length) {
      console.log(`📝 Lägger till resterande ${csvPlants.length - allPlantsToSave.length} växter utan API-data...`)

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

    // 2. Sedan: HÃ¤mta mÃ¥nga fler vÃ¤xter direkt frÃ¥n API (only if we haven't hit rate limit)
    if (apiCallsCount < MAX_API_CALLS) {
      console.log("🌍 Hämtar ytterligare växter från API...")
      const apiPlants = await fetchAllPlantsFromAPI(5) // Reduce to 5 pages to stay under rate limit

      console.log(`📦 Hämtade ${apiPlants.length} växter från API`)

      // Konvertera API-vÃ¤xter till vÃ¥rt format
      const convertedAPIPlants = apiPlants.map(convertAPIPlantToOurFormat)

      // Filtrera bort dubbletter (om samma vÃ¤xt finns i bÃ¥de CSV och API)
      const existingPerenualIds = new Set(
        allPlantsToSave
          .filter(plant => plant.perenualId)
          .map(plant => plant.perenualId)
      )

      const uniqueAPIPlants = convertedAPIPlants.filter(plant =>
        plant.perenualId && !existingPerenualIds.has(plant.perenualId)
      )

      console.log(`🔄 ${uniqueAPIPlants.length} unika API-växter efter dubblettfiltrering`)

      // LÃ¤gg till API-vÃ¤xter
      allPlantsToSave = [...allPlantsToSave, ...uniqueAPIPlants]
    } else {
      console.log("⏰ Hoppar över ytterligare API-anrop pga rate limit")
    }

    // CHANGE: Better error handling for database saves
    console.log(`💾 Sparar ${allPlantsToSave.length} växter till databasen...`)

    // Save in smaller batches to handle validation errors better
    const savedPlants = []
    const batchSize = 10

    for (let i = 0; i < allPlantsToSave.length; i += batchSize) {
      const batch = allPlantsToSave.slice(i, i + batchSize)

      try {
        const saved = await Plant.insertMany(batch, { ordered: false })
        savedPlants.push(...saved)
        console.log(`✅ Sparade batch ${Math.floor(i / batchSize) + 1}: ${saved.length} växter`)
      } catch (error) {
        console.log(`⚠️ Fel vid batch ${Math.floor(i / batchSize) + 1}:`, error.message)

        // Try saving individually to see which plants cause issues
        for (const plantData of batch) {
          try {
            const saved = await Plant.create(plantData)
            savedPlants.push(saved)
          } catch (individualError) {
            console.log(`❌ Misslyckades spara växt ${plantData.swedishName}:`, individualError.message)
          }
        }
      }
    }

    console.log(`🎉 Import klar!`)
    console.log(`📊 Totalt sparade ${savedPlants.length} växter:`)
    console.log(`   - ${csvPlants.length} från CSV`)
    console.log(`   - API anrop gjorda: ${apiCallsCount}`)

    // Visa exempel pÃ¥ fÃ¶rsta vÃ¤xten
    if (savedPlants.length > 0) {
      console.log("\n📋 Exempel på importerad växt:")
      console.log(JSON.stringify(savedPlants[0], null, 2))
    }

  } catch (err) {
    console.error("💥 Fel vid seedning:", err.message)
    console.error(err)
  } finally {
    console.log("🔌 Stänger databasanslutning...")
    mongoose.disconnect()
    process.exit(0)
  }
}

// KÃ¶r endast om filen kÃ¶rs direkt (inte importerad)
seedCombinedData()