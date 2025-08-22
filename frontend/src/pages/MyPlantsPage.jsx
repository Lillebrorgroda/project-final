
import { useNavigate } from "react-router-dom";

import PlantList from "../components/PlantList"
import "../index.css"




const MyPlantsPage = () => {

  const navigate = useNavigate();
  return (
    <div className="my-plant-page">
      <i className="bx bx-chevron-left" onClick={() => navigate("/")}></i>
      <img src="/Broccoli.jpg" alt="Broccoli" />
      <h2>Mina växter</h2>
      <PlantList />
    </div>
  )
}
export default MyPlantsPage