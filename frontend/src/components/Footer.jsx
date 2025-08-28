import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { FaHouse, FaMagnifyingGlass, FaSeedling, FaCalendarDays } from "react-icons/fa6"
import { FooterStyled, FooterIcon } from "../styles/stylecomponents/StyledComponentsLibrary"

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
    <FooterStyled>
      <FooterIcon onClick={() => handleHomeNavigation()} >
        <FaHouse />
      </FooterIcon>

      < FooterIcon onClick={() => navigate("/search")} >
        <FaMagnifyingGlass />
      </FooterIcon>
      <FooterIcon
        className={!token ? "disabled" : ""}
        onClick={() => handleProtectedNavigation("/plants/saved", "se sparade växter")}
      >
        <FaSeedling />
      </FooterIcon>
      {/*  <FooterIcon
        className={!token ? "disabled" : ""}
        onClick={() => handleProtectedNavigation("/events", "se kalendern")}
      >
        <FaCalendarDays />
      </FooterIcon>*/}
    </FooterStyled>
  )
}

export default Footer