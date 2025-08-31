import { useEffect, useState } from "react"
import plantsAPI from "../api/plants"
import {
  PlantListContainer,
  EmptyMessage,
  LoadingMessage,
  ErrorMessage,
  ThemedPlantsGrid,
  ThemedPlantCard,
  PlantImage,
  PlantContent,
  PlantHeader,
  PlantName,
  ScientificName,
  PlantFacts,
  PlantNotes,
  RemoveButton,
  GridLayout,
  StyledP
} from "../styles/stylecomponents/StyledComponentsLibrary"

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
        const data = await plantsAPI.getSavedPlants(token)
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
    if (!window.confirm("Är du säker på att du vill ta bort denna växt?")) return

    try {
      await plantsAPI.deleteSavedPlant(savedPlantId, token)
      setSavedPlants(prev =>
        prev.filter(entry => entry._id !== savedPlantId)
      )
    } catch (err) {
      setError("Kunde inte ta bort växten: " + err.message)
    }
  }

  if (loading) {
    return (
      <PlantListContainer>
        <StyledP>Laddar sparade växter...</StyledP>
      </PlantListContainer>
    )
  }

  if (error) {
    return (
      <PlantListContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </PlantListContainer>
    )
  }

  return (
    <PlantListContainer>
      {savedPlants.length === 0 ? (
        <StyledP>Inga sparade växter än!</StyledP>
      ) : (
        <GridLayout>
          {savedPlants.map((entry) => (
            <ThemedPlantCard key={entry._id}>
              <PlantImage
                src={entry.plant.imageUrl || "/Frog.jpg"}
                alt={entry.plant.swedishName || entry.plant.commonName}
                className="plant-image"
              />
              <PlantContent>
                <PlantHeader>
                  <PlantName>
                    {entry.plant.swedishName || entry.plant.commonName}
                  </PlantName>
                  <ScientificName>{entry.plant.scientificName}</ScientificName>
                </PlantHeader>

                <PlantFacts>
                  <p><strong>Beskrivning:</strong> {entry.plant.description}</p>
                  <p><strong>Vattning:</strong> {entry.plant.watering}</p>
                  <p><strong>Ljus:</strong> {entry.plant.sunlight}</p>
                </PlantFacts>

                {entry.notes && (
                  <PlantNotes>
                    <p>{entry.notes}</p>
                  </PlantNotes>
                )}

                <FaTrash
                  onClick={() => handleRemove(entry._id)}
                  disabled={loading}

                />
              </PlantContent>
            </ThemedPlantCard>
          ))}
        </GridLayout>
      )}
    </PlantListContainer>
  )
}

export default PlantList