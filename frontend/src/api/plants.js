const API_URL = "http://localhost:8080";

const getPlants = () =>
  fetch(`${API_URL}/plants`)
    .then(res => res.json());

const getPlantsByMonthAndCompanion = (month, companion) =>
  fetch(`${API_URL}/plants?month=${month}&companion=${companion}`)
    .then(res => res.json());

export default {
  getPlants,
  getPlantsByMonthAndCompanion
}
