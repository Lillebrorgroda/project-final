import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import PlantPage from "./pages/PlantsPage";
import CalenderPage from "./pages/CalenderPage";
import MyPlantsPage from "./pages/MyPlantsPage";
import AccountPage from "./pages/AccountPage";
import "./index.css";



const App = () => {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken("");
    setUsername("");
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <div>

      {token && (
        <div className="header">
          <span>Inloggad som: {username || "Användare"}</span>
          <button onClick={handleLogout}>Logga ut</button>
        </div>)}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage setToken={setToken} setUsername={setUsername} />} />
        <Route path="/login" element={<LoginPage setToken={setToken} setUsername={setUsername} />} />
        <Route path="/search" element={<PlantPage token={token} />} />
        <Route path="/calender" element={<CalenderPage setToken={setToken} setUsername={setUsername} />} />
        <Route path="/account" element={<AccountPage setToken={setToken} setUsername={setUsername} />} />
        <Route path="/plants/saved" element={<MyPlantsPage setToken={setToken} setUsername={setUsername} />} />
        <Route path="*" element={<h2>404 - Sidan hittades inte</h2>} />

      </Routes>


      <div className="footer">
        <Link to="/account"><i className="fa-solid fa-house"></i></Link>
        <i className="fa-solid fa-magnifying-glass" onClick={() => navigate("/search")}></i>
        <i className="fa-solid fa-seedling" onClick={() => navigate("/plants/saved")}></i>
        <i className="fa-solid fa-calendar-days" onClick={() => navigate("/calender")}></i >



      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
