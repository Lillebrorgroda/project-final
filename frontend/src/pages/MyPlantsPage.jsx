
import { useNavigate } from "react-router-dom";
import PlantList from "../components/PlantList"
import { FullscreenWrapper, PageWrapper } from "../styles/components/Layout.styles";




const MyPlantsPage = () => {

  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  return (

    <main>
      <FullscreenWrapper>
        <PageWrapper>

          <i className="bx bx-chevron-left" onClick={() => navigate("/")}></i>
          <img className="plant-image" src="/Broccoli.jpg" alt="Broccoli" />
          <h2>Mina växter</h2>
          {/**<div> Add your own plants 
            <i className="fa-solid fa-plus"></i>
            <p>Lägg till egna plantor</p>
            <input type="text" />

          </div>*/}



          <PlantList token={token} />
        </PageWrapper>
      </FullscreenWrapper>

    </main>

  )
}
export default MyPlantsPage