
import { useNavigate } from "react-router-dom";

import PlantList from "../components/PlantList"
import "../index.css"




const MyPlantsPage = () => {

  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  return (
    <div className="my-plant-page">
      <i className="bx bx-chevron-left" onClick={() => navigate("/")}></i>
      <img src="/Broccoli.jpg" alt="Broccoli" />
      <h2>Mina växter</h2>
      <div> {/**Add your own plants */}
        <i className="fa-solid fa-plus"></i>
        <p>Lägg till egna plantor</p>
        <input type="text" />

      </div>

      <PlantList token={token} />
    </div>
  )
}
export default MyPlantsPage