import { useState } from "react";
import plantsAPI from "../api/plants"; // Din API-fil för växter

const PlantPage = ({ token }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await plantsAPI.searchPlants(searchQuery, token);
      setPlants(res || []);
    } catch (err) {
      setError("Kunde inte hämta växter: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (plant) => {
    if (!token) {
      setError("Du måste vara inloggad för att spara växter.");
      return;
    }
    try {
      await plantsAPI.savePlant(plant, token);
      setMessage("Växten har sparats!");
    } catch (err) {
      setError("Kunde inte spara växten: " + err.message);
    }
  }

  return (
    <div className="plant-page">
      <h2>Sök växter</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Sök på namn eller vetenskapligt namn"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Sök</button>
      </div>

      {loading && <p>Söker...</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}

      {plants.length > 0 ? (
        <ul className="plant-list">
          {plants.map((plant) => (
            <li key={plant._id || plant.id}>
              {plant.name} {plant.scientificName && `(${plant.scientificName})`}
              {token && (
                <button className="save-btn" onClick={() => handleSave(plant)}>Spara</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>Inga växter att visa.</p>
      )}
    </div>
  );
};

export default PlantPage;
