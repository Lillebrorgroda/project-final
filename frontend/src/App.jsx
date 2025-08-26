import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import PlantPage from "./pages/PlantsPage";
import CalenderPage from "./pages/CalenderPage";
import MyPlantsPage from "./pages/MyPlantsPage";
import AccountPage from "./pages/AccountPage";
import Footer from "./components/Footer";
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
    const savedToken = localStorage.getItem("token")
    console.log('Loading token from localStorage:', savedToken)
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  console.log('Current token in App:', token)

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
        <Route path="/events" element={<CalenderPage setToken={token} setUsername={setUsername} />} />
        <Route path="/account" element={<AccountPage setToken={token} setUsername={setUsername} />} />
        <Route path="/plants/saved" element={<MyPlantsPage setToken={token} setUsername={setUsername} />} />
        <Route path="*" element={<h2>404 - Sidan hittades inte</h2>} />

      </Routes>

      <Footer />
      <Toaster position="top-center" />
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
