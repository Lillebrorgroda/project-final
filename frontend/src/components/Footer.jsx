import { useNavigate, Link } from "react-router"
import toast from "react-hot-toast"


const Footer = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const handleProtectedNavigation = (path, actionName) => {

    if (token) {
      navigate(path)
    } else {
      toast.error(`Du måste vara inloggad för att ${actionName}`, { icon: "🔒" })
    }
  }

  return (

    <div className="footer">
      <Link to="/"><i className="fa-solid fa-house"></i></Link>
      <i className="fa-solid fa-magnifying-glass" onClick={() => navigate("/search")}></i>

      <i
        className={`fa-solid fa-seedling ${!token ? "disabled" : ""}`} onClick={() => handleProtectedNavigation("/plants/saved", "se sparade växter")}></i>
      <i
        className={`fa-solid fa-calendar-days ${!token ? "disabled" : ""}`} onClick={() => handleProtectedNavigation("/calender", "se kalendern")}></i >



    </div>

  )

}

export default Footer