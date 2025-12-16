import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import plantsAPI from "../api/plants"
import {
  PlantImage,
  PlantSearchHeader,
  PlantName,
  ScientificName,
  ApiBadge,
  PlantDetails,
  DetailTag,
  SearchSection,
  SearchInfo,
  ErrorMessage,
  StyledP,
  PlantContent,
  PlantFacts,
  PlantHeader

} from "../styles/stylecomponents/StyledComponentsLibrary"
import { FullscreenWrapper, PageWrapper, ScrollableWrapper } from "../styles/components/Layout.styles"
import { PrimaryButton } from "../styles/components/Button.styles"
import { BaseCard, PlantSearchCard } from "../styles/components/Card.styles"
import { GridLayout } from "../styles/components/Layout.styles"
import { StyledInput, SearchBar } from "../styles/components/Form.styles"

const PlantPage = ({ token }) => {
  // States
  const [searchQuery, setSearchQuery] = useState("")
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [searchInfo, setSearchInfo] = useState(null)
  const navigate = useNavigate()

  // Filter states (kommenterat ut som i original)
  const [filters, setFilters] = useState({
    startMonth: "",
    endMonth: "",
    companion: "",
    sunlight: "",
    watering: "",
    includeAPI: true
  })

  const [filterOptions, setFilterOptions] = useState({
    sunlightOptions: [],
    wateringOptions: [],
    companionOptions: []
  })

  useEffect(() => {
    loadFilterOptions()
  }, [])

  const loadFilterOptions = async () => {
    try {
      const options = await plantsAPI.getFilterOptions()
      setFilterOptions(options)
    } catch (err) {
      console.error("Kunde inte ladda filter-alternativ:", err)
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    setError("")
    setMessage("")
    setSearchInfo(null)

    try {
      const searchParams = {
        search: searchQuery.trim() || undefined,
        ...filters
      }

      // Ta bort tomma filter
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === "" || searchParams[key] === undefined) {
          delete searchParams[key]
        }
      })

      const res = await plantsAPI.searchPlants(searchParams, token)

      if (res.success) {
        setPlants(res.plants || [])
        setSearchInfo({
          total: res.count,
          dbCount: res.dbCount,
          apiCount: res.apiCount,
          searchedInAPI: res.searchedInAPI,
          searchTerm: res.searchTerm
        })
      } else {
        setError("Sökning misslyckades")
      }
    } catch (err) {
      setError("Kunde inte hämta växter: " + err.message)
    } finally {
      setLoading(false)
      setSearchQuery("")
    }
  }

  const handleSavePlant = async (plant, notes = "") => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Du måste vara inloggad för att spara växter.")
      return
    }

    try {
      setLoading(true)

      if (plant.isFromAPI) {
        await plantsAPI.saveAPIPlantToGarden(plant, token, notes)
        setMessage(`🌱 ${plant.swedishName || plant.commonName} har lagts till i din trädgård!`);
      } else {
        await plantsAPI.saveExistingPlantAsFavorite(plant._id, token, notes)
        setMessage(`❤️ ${plant.swedishName || plant.commonName} har sparats som favorit!`);
      }
      setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      setError("Kunde inte spara växten: " + err.message)
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <FullscreenWrapper>
        <PageWrapper>

          {/* Header */}
          <img className="plant-image" src="/Broccoli.jpg" alt="Broccoli" />
          <h2>
            Sök växter
          </h2>

          {/* Search Section */}
          <SearchSection>
            <SearchBar>
              <StyledInput
                type="text"
                aria-label="Sökfält"
                placeholder="Sök på namn eller vetenskapligt namn"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <PrimaryButton
                onClick={handleSearch}
                disabled={loading}
                style={{ marginLeft: '10px', whiteSpace: 'nowrap' }}
              >
                {loading ? "Söker..." : "Sök"}
              </PrimaryButton>



            </SearchBar>
          </SearchSection>
        </PageWrapper>

        {/* Messages */}
        {loading && <StyledP>Söker...</StyledP>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {
          message && (
            <div style={{
              textAlign: 'center',
              padding: '15px',
              background: '#d4edda',
              color: '#155724',
              borderRadius: '8px',
              margin: '20px 0',
              fontSize: '1.4rem'
            }}>
              {message}
            </div>
          )
        }

        {/* Search Info */}
        {
          searchInfo && (
            <SearchInfo>
              <p>
                Hittade {searchInfo.total} växter
                {searchInfo.searchTerm && ` för "${searchInfo.searchTerm}"`}
              </p>
              {searchInfo.searchedInAPI && (
                <p className="api-info">
                  📡 {searchInfo.dbCount} från din databas, {searchInfo.apiCount} från extern databas
                </p>
              )}
            </SearchInfo>
          )
        }

        {/* Plant List */}
        {/*<ScrollableWrapper>*/}
        {plants.length > 0 ? (
          <GridLayout>
            {plants.map((plant) => (
              <BaseCard
                key={plant._id}
                className={plant.isFromAPI ? 'from-api' : 'from-db'}
              >
                {plant.imageUrl && (
                  <PlantImage
                    src={plant.imageUrl}
                    alt={plant.swedishName || plant.commonName}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}

                <PlantContent>
                  <PlantHeader>
                    <div>
                      <PlantName>{plant.swedishName || plant.commonName}</PlantName>
                      {plant.scientificName && (
                        <ScientificName>{plant.scientificName}</ScientificName>
                      )}
                    </div>
                    {plant.isFromAPI && (
                      <ApiBadge>Extern källa</ApiBadge>
                    )}
                  </PlantHeader>

                  <PlantFacts>

                    {plant.description && (
                      <StyledP>
                        {plant.description.substring(0, 150)}
                        {plant.description.length > 150 ? '...' : ''}
                      </StyledP>
                    )}

                    <PlantDetails>
                      {plant.sunlight && plant.sunlight.length > 0 && (
                        <DetailTag>
                          ☀️ {plant.sunlight.join(', ')}
                        </DetailTag>
                      )}
                      {plant.watering && plant.watering.length > 0 && (
                        <DetailTag>
                          💧 {plant.watering.join(', ')}
                        </DetailTag>
                      )}
                      {plant.isEdible && (
                        <DetailTag className="edible">
                          🍽️ Ätbar
                        </DetailTag>
                      )}
                    </PlantDetails>

                    {plant.companionPlantNames && plant.companionPlantNames.length > 0 && (
                      <StyledP>
                        <strong>Kompanjoner:</strong> {plant.companionPlantNames.join(', ')}
                      </StyledP>
                    )}
                  </PlantFacts>

                  {token && (
                    <PrimaryButton
                      className={plant.isFromAPI ? 'save-to-garden' : 'save-as-favorite'}
                      onClick={() => handleSavePlant(plant)}
                      disabled={plant.isSaved}
                      style={{
                        backgroundColor: plant.isSaved ? '#28a745' :
                          plant.isFromAPI ? '#007bff' : '#6f42c1',
                        cursor: plant.isSaved ? 'default' : 'pointer'
                      }}

                    >
                      {plant.isSaved ? '✅ Sparad!' :
                        plant.isFromAPI ? '🌱 Lägg till i min trädgård' : '❤️ Spara som favorit'}
                    </PrimaryButton>
                  )}
                </PlantContent>
              </BaseCard>
            ))}
          </GridLayout>
        ) : (
          !loading && searchInfo && (
            <StyledP>
              {searchInfo.searchedInAPI
                ? "Inga växter hittades varken i din databas eller extern databas."
                : "Inga växter hittades i databasen. Prova att aktivera extern sökning."
              }
            </StyledP>
          )
        )}
        {/*</ScrollableWrapper>*/}

      </FullscreenWrapper>
    </main>
  )
}

export default PlantPage