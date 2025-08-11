// src/api/plants.js
const BASE_URL = "http://localhost:8080";

const plantsAPI = {
  searchPlants: async (query, token) => {
    const res = await fetch(`${BASE_URL}/plants/search?q=${encodeURIComponent(query)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error("Nätverksfel");
    return await res.json();
  },

  savePlant: async (plant, token) => {
    const res = await fetch(`${BASE_URL}/plants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(plant)
    });
    if (!res.ok) throw new Error("Kunde inte spara växt");
    return await res.json();
  },
};

export default plantsAPI;
