

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const plantsAPI = {
  // Förbättrad sökning med filter och API-fallback
  searchPlants: async (searchParams = {}, token) => {
    const {
      search,
      startMonth,
      endMonth,
      companion,
      sunlight,
      watering,
      includeAPI = true
    } = searchParams;

    // Bygg query parameters
    const params = new URLSearchParams();

    if (search) params.append('search', search);
    if (startMonth) params.append('startMonth', startMonth);
    if (endMonth) params.append('endMonth', endMonth);
    if (companion) params.append('companion', companion);
    if (sunlight) params.append('sunlight', sunlight);
    if (watering) params.append('watering', watering);
    if (includeAPI !== undefined) params.append('includeAPI', includeAPI);

    const url = `${BASE_URL}/plants${params.toString() ? '?' + params.toString() : ''}`;

    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (!res.ok) throw new Error("Nätverksfel vid sökning");
    return await res.json();
  },

  // Hämta specifik växt
  getPlant: async (plantId, token) => {
    const res = await fetch(`${BASE_URL}/plants/${plantId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error("Kunde inte hämta växt");
    return await res.json();
  },



  saveAPIPlantToGarden: async (apiPlant, notes, token) => {
    const res = await fetch(`${BASE_URL}/plants/save-and-favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ apiPlant, notes })
    });
    if (!res.ok) throw new Error("Kunde inte spara API-växt");
    return await res.json();
  },

  saveExistingPlantAsFavorite: async (plantId, notes = "", token) => {
    const res = await fetch(`${BASE_URL}/plants/saved`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ plantId, notes })
    });
    if (!res.ok) throw new Error("Kunde inte spara växt som favorit");
    return await res.json();
  },


  getMyGarden: async (token) => {
    const res = await fetch(`${BASE_URL}/plants/saved`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    if (!res.ok) throw new Error("Kunde inte hämta sparade växter");
    return await res.json()
  },


  // Uppdatera växt
  updatePlant: async (plantId, updates, token) => {
    const res = await fetch(`${BASE_URL}/plants/${plantId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error("Kunde inte uppdatera växt");
    return await res.json();
  },

  // Ta bort växt
  removePlantFromGarden: async (savedPlantId, token) => {
    const res = await fetch(`${BASE_URL}/plants/${savedPlantId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Kunde inte ta bort växt");
    return await res.json();
  },

};

export default plantsAPI;