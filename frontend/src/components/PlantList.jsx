import { useEffect, useState } from "react"
import styled from "styled-components"
import plantsAPI from "../api/plants"

// Styled components
const PlantListContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`

const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  font-size: 18px;
  margin: 40px 0;
`;

const PlantGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PlantCard = styled.li`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const PlantImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

const PlantContent = styled.div`
  padding: 20px;
`;

const PlantHeader = styled.div`
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const PlantName = styled.h3`
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
`;

const ScientificName = styled.h4`
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
  font-style: italic;
  font-weight: 400;
`;

const PlantFacts = styled.div`
  margin-bottom: 15px;
  
  p {
    margin: 8px 0;
    color: #555;
    font-size: 14px;
    line-height: 1.5;
  }
`;

const PlantNotes = styled.div`
  p {
    margin: 0;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 6px;
    color: #495057;
    font-size: 14px;
    font-style: italic;
    border-left: 3px solid #28a745;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 20px;
  background: #fdf2f2;
  border-radius: 8px;
  margin: 20px 0;
`;

const RemoveButton = styled.button`
    background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  
  &:hover {
    background: #c0392b;
  }
`

const PlantList = ({ token }) => {
  const [savedPlants, setSavedPlants] = useState([]);
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
        const data = await plantsAPI.getSavedPlants(token);
        setSavedPlants(data.savedPlants || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchSavedPlants();
    }
  }, [token]);

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

  if (loading) return <p>Laddar sparade växter...</p>

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <PlantListContainer>
      {savedPlants.length === 0 ? (
        <EmptyMessage>Inga sparade växter än!</EmptyMessage>
      ) : (
        <PlantGrid>
          {savedPlants.map((entry) => (
            <PlantCard key={entry._id}>
              <PlantImage
                src={entry.plant.imageUrl || "/Frog.jpg"} alt={entry.plant.swedishName || entry.plant.commonName} />
              <PlantContent>
                <PlantHeader>
                  <PlantName>{entry.plant.swedishName || entry.plant.commonName}</PlantName>
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
                <RemoveButton onClick={() => handleRemove(entry._id)}>Ta bort</RemoveButton>
              </PlantContent>
            </PlantCard>
          ))}
        </PlantGrid>
      )}
    </PlantListContainer>
  );
};

export default PlantList;