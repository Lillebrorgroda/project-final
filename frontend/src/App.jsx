import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import PlantPage from "./pages/PlantsPage";
import CalenderPage from "./pages/CalenderPage";
import "./index.css";

const LandingPage = () => (
  <div className="landing">
    <h2>Välkommen till trädgården!</h2>
    <p>Vill du:</p>
    <Link to="/signup"><button>Registrera dig</button></Link>
    <Link to="/login"><button>Logga in</button></Link>
    <Link to="/search"><button>Söka växt</button></Link>
  </div>
);

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
        </div>
      )}

      <h1>Plant Companion App</h1>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage setToken={setToken} setUsername={setUsername} />} />
        <Route path="/login" element={<LoginPage setToken={setToken} setUsername={setUsername} />} />
        <Route path="/search" element={<PlantPage token={token} />} />
        <Route path="/calender" element={<CalenderPage setToken={setToken} setUsername={setUsername} />} />

      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
