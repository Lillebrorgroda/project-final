import { useNavigate } from "react-router-dom"
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

  const handleHomeNavigation = () => {
    if (token) {
      navigate("/account")
    } else {
      toast("Logga in för att se all funktionalitet", {
        icon: "ℹ️"
      })
      navigate("/")
    }
  }

  return (
    <div className="footer">
      <i className="fa-solid fa-house" onClick={() => handleHomeNavigation()}></i>
      <i className="fa-solid fa-magnifying-glass" onClick={() => navigate("/search")}></i>

      <i
        className={`fa-solid fa-seedling ${!token ? "disabled" : ""}`} onClick={() => handleProtectedNavigation("/plants/saved", "se sparade växter")}></i>
      <i
        className={`fa-solid fa-calendar-days ${!token ? "disabled" : ""}`} onClick={() => handleProtectedNavigation("/calender", "se kalendern")}></i >
    </div>

  )

}

export default Footer