import { useState, useEffect } from "react";
import plantsAPI from "../api/plants";
import { useNavigate } from "react-router-dom";

const PlantPage = ({ token }) => {
  // Sökstatus
  const [searchQuery, setSearchQuery] = useState("");
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Filter
  const [filters, setFilters] = useState({
    startMonth: "",
    endMonth: "",
    companion: "",
    sunlight: "",
    watering: "",
    includeAPI: true
  });

  // Filter-alternativ från backend
  const [filterOptions, setFilterOptions] = useState({
    sunlightOptions: [],
    wateringOptions: [],
    companionOptions: []
  });

  // Sökresultat info
  const [searchInfo, setSearchInfo] = useState(null);

  // Ladda filter-alternativ när komponenten mountas
  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const options = await plantsAPI.getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      console.error("Kunde inte ladda filter-alternativ:", err);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    setSearchInfo(null);

    try {
      const searchParams = {
        search: searchQuery.trim() || undefined,
        ...filters
      };

      // Ta bort tomma filter
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === "" || searchParams[key] === undefined) {
          delete searchParams[key];
        }
      });

      const res = await plantsAPI.searchPlants(searchParams, token);

      if (res.success) {
        setPlants(res.plants || []);
        setSearchInfo({
          total: res.count,
          dbCount: res.dbCount,
          apiCount: res.apiCount,
          searchedInAPI: res.searchedInAPI,
          searchTerm: res.searchTerm
        });
      } else {
        setError("Sökning misslyckades");
      }
    } catch (err) {
      setError("Kunde inte hämta växter: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Spara vanlig växt till användarens sparade växter

  const handleSavePlant = async (plant, notes = "") => {

    const token = localStorage.getItem("token")
    if (!token) {
      setError("Du måste vara inloggad för att spara växter.");
      return;
    }

    try {
      if (plant.isFromAPI) {
        // Använd den kombinerade endpointen för API-växter
        await plantsAPI.saveAPIPlantAndFavorite(plant, token, notes);
      } else {
        // Vanlig databas-växt, spara bara till favoriter
        await plantsAPI.savePlantToAccount(plant._id, token, notes);
      }

      setMessage(`${plant.commonName || plant.swedishName} har sparats!`);
    } catch (err) {
      setError("Kunde inte spara växten: " + err.message);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      startMonth: "",
      endMonth: "",
      companion: "",
      sunlight: "",
      watering: "",
      includeAPI: true
    });
    setSearchQuery("");
  };

  return (
    <div className="plant-page">
      <i className="bx bx-chevron-left" onClick={() => navigate("/")} ></i>
      <img src="/Broccoli.jpg" alt="Broccoli" />
      <h2>Sök växter</h2>

      {/* Sökfält */}
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Sök på namn, vetenskapligt namn eller beskrivning..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? "Söker..." : "Sök"}
          </button>
        </div>

        {/* Filter */}
        {/* <div className="filters">
          <h3>Filter</h3>

          <div className="filter-row">
            <div className="filter-group">
              <label>Såning från månad:</label>
              <select
                value={filters.startMonth}
                onChange={(e) => handleFilterChange('startMonth', e.target.value)}
              >
                <option value="">Alla månader</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i).toLocaleDateString('sv-SE', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Till månad:</label>
              <select
                value={filters.endMonth}
                onChange={(e) => handleFilterChange('endMonth', e.target.value)}
              >
                <option value="">Alla månader</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i).toLocaleDateString('sv-SE', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Ljusbehov:</label>
              <select
                value={filters.sunlight}
                onChange={(e) => handleFilterChange('sunlight', e.target.value)}
              >
                <option value="">Alla ljusförhållanden</option>
                {filterOptions.sunlightOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Vattenbehov:</label>
              <select
                value={filters.watering}
                onChange={(e) => handleFilterChange('watering', e.target.value)}
              >
                <option value="">Alla vattenförhållanden</option>
                {filterOptions.wateringOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Kompanjonväxt:</label>
              <select
                value={filters.companion}
                onChange={(e) => handleFilterChange('companion', e.target.value)}
              >
                <option value="">Alla kompanjoner</option>
                {filterOptions.companionOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>
                <input
                  type="checkbox"
                  checked={filters.includeAPI}
                  onChange={(e) => handleFilterChange('includeAPI', e.target.checked)}
                />
                Sök också i extern databas
              </label>
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={clearFilters} className="clear-filters">
              Rensa filter
            </button>
          </div>
      </div>*/}
      </div>

      {/* Meddelanden */}
      {loading && <p className="loading">Söker...</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {/* Sökresultat info */}
      {searchInfo && (
        <div className="search-info">
          <p>
            Hittade {searchInfo.total} växter
            {searchInfo.searchTerm && ` för "${searchInfo.searchTerm}"`}
          </p>
          {searchInfo.searchedInAPI && (
            <p className="api-info">
              📡 {searchInfo.dbCount} från din databas, {searchInfo.apiCount} från extern databas
            </p>
          )}
        </div>
      )}

      {/* Växtlista */}
      {plants.length > 0 ? (
        <div className="plant-list">
          {plants.map((plant) => (
            <div key={plant._id} className={`plant-card ${plant.isFromAPI ? 'from-api' : 'from-db'}`}>
              <div className="plant-header">
                <h3>{plant.swedishName || plant.commonName}</h3>
                {plant.isFromAPI && (
                  <span className="api-badge">Extern källa</span>
                )}
              </div>

              {plant.imageUrl && (
                <img
                  src={plant.imageUrl}
                  alt={plant.swedishName || plant.commonName}
                  className="plant-image"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}

              <div className="plant-info">
                {plant.scientificName && (
                  <p className="scientific-name">
                    <em>{plant.scientificName}</em>
                  </p>
                )}

                {plant.description && (
                  <p className="description">
                    {plant.description.substring(0, 150)}
                    {plant.description.length > 150 ? '...' : ''}
                  </p>
                )}

                <div className="plant-details">
                  {plant.sunlight && plant.sunlight.length > 0 && (
                    <span className="detail-tag">
                      ☀️ {plant.sunlight.join(', ')}
                    </span>
                  )}
                  {plant.watering && plant.watering.length > 0 && (
                    <span className="detail-tag">
                      💧 {plant.watering.join(', ')}
                    </span>
                  )}
                  {plant.isEdible && (
                    <span className="detail-tag edible">
                      🍽️ Ätbar
                    </span>
                  )}
                </div>

                {plant.companionPlantNames && plant.companionPlantNames.length > 0 && (
                  <p className="companions">
                    <strong>Kompanjoner:</strong> {plant.companionPlantNames.join(', ')}
                  </p>
                )}
              </div>

              <div className="plant-actions">
                {token && (
                  <button
                    className={`save-btn ${plant.isFromAPI ? 'save-api' : 'save-regular'}`}
                    onClick={() => handleSavePlant(plant)}
                  >
                    {plant.isFromAPI ? 'Spara till databas' : 'Spara växt'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && searchInfo && (
          <p className="no-results">
            {searchInfo.searchedInAPI
              ? "Inga växter hittades varken i din databas eller extern databas."
              : "Inga växter hittades i databasen. Prova att aktivera extern sökning."
            }
          </p>
        )
      )}
    </div>
  );
};

export default PlantPage;