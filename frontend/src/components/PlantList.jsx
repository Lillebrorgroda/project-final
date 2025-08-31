import { useEffect, useState } from "react"
import plantsAPI from "../api/plants"
import {
  ErrorMessage,
  PlantImage,
  PlantContent,
  PlantHeader,
  PlantName,
  ScientificName,
  PlantFacts,
  PlantNotes,
  StyledP

} from "../styles/stylecomponents/StyledComponentsLibrary"
import { BaseCard } from "../styles/components/Card.styles"
import { GridLayout } from "../styles/components/Layout.styles"
import { RemoveButton } from "../styles/components/Button.styles"

import { FaTrash } from "react-icons/fa6"


const PlantList = ({ token }) => {
  const [savedPlants, setSavedPlants] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSavedPlants = async () => {
      if (!token) {
        setError("Du måste vara inloggad.")
        setLoading(false)
        return
      }

      try {
        const data = await plantsAPI.getMyGarden(token)
        setSavedPlants(data.savedPlants || [])
        setError("")
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchSavedPlants()
    }
  }, [token])

  const handleRemove = async (savedPlantId) => {
    if (!window.confirm(`Är du säker på att du vill ta bort ${plantName} från din trädgård?`)) return

    try {
      await plantsAPI.removePlantFromGarden(savedPlantId, token)
      setSavedPlants(prev =>
        prev.filter(entry => entry._id !== savedPlantId)
      )

      //Add Success state here
    } catch (err) {
      setError("Kunde inte ta bort växten: " + err.message)
    }
  }

  if (loading) {
    return (

      <StyledP>Laddar din trädgård.. 🌱</StyledP>

    )
  }

  if (error) {
    return (
      <ErrorMessage>{error}</ErrorMessage>

    )
  }

  return (
    <div>
      {savedPlants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <StyledP>Din trädgård är tom ännu! 🌱</StyledP>
          <StyledP>Gå till sökfunktionen för att lägga till växter.</StyledP>
        </div>
      ) : (
        <GridLayout>
          {savedPlants.map((entry) => (
            <BaseCard key={entry._id}>
              <PlantImage
                src={entry.plant.imageUrl || "/Frog.jpg"}
                alt={entry.plant.swedishName || entry.plant.commonName}
                className="plant-image"
                onError={(e) => {
                  e.target.src = "/Frog.jpg"
                }}
              />
              <PlantContent>
                <PlantHeader>
                  <PlantName>
                    {entry.plant?.swedishName || entry.plant?.commonName || "Okänd växt"}
                  </PlantName>
                  {entry.plant?.scientificName && (
                    <ScientificName>{entry.plant.scientificName}</ScientificName>
                  )}
                </PlantHeader>

                <PlantFacts>
                  {/* ✅ FIX: Säker rendering av array-data */}
                  {entry.plant?.description && (
                    <p><strong>Beskrivning:</strong> {entry.plant.description}</p>
                  )}

                  {entry.plant?.watering && entry.plant.watering.length > 0 && (
                    <p><strong>Vattning:</strong> {
                      Array.isArray(entry.plant.watering)
                        ? entry.plant.watering.join(', ')
                        : entry.plant.watering
                    }</p>
                  )}

                  {entry.plant?.sunlight && entry.plant.sunlight.length > 0 && (
                    <p><strong>Ljus:</strong> {
                      Array.isArray(entry.plant.sunlight)
                        ? entry.plant.sunlight.join(', ')
                        : entry.plant.sunlight
                    }</p>
                  )}

                  {/* ✅ TILLÄGG: Visa när växten sparades */}
                  <p><strong>Sparad:</strong> {new Date(entry.savedAt).toLocaleDateString('sv-SE')}</p>

                  {/* ✅ TILLÄGG: Visa källa */}
                  {entry.plant?.source && (
                    <p><strong>Källa:</strong> {
                      entry.plant.source === 'api' ? 'Extern databas' : 'Lokal databas'
                    }</p>
                  )}
                </PlantFacts>

                {entry.notes && entry.notes.trim() && (
                  <PlantNotes>
                    <strong>Mina anteckningar:</strong>
                    <p>{entry.notes}</p>
                  </PlantNotes>
                )}

                <RemoveButton
                  onClick={() => handleRemove(entry._id, entry.plant?.swedishName || entry.plant?.commonName)}
                  disabled={loading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc3545',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '8px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s',
                    marginTop: '10px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8d7da'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  title="Ta bort från trädgård"
                >
                  <FaTrash />
                </RemoveButton>
              </PlantContent>
            </BaseCard>
          ))}
        </GridLayout>
      )}
    </div>
  )
}

export default PlantList