import { useState, useEffect } from "react";
import authAPI from "./api/auth";
import plantsAPI from "./api/plants";
import SignUp from "./pages/SignupPage";
import Login from "./pages/LoginPage";

const App = () => {
  const [token, setToken] = useState("");
  const [plants, setPlants] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [signupMessage, setSignupMessage] = useState("");

  const handleSignup = async () => {
    const res = await authAPI.signup(username, email, password);
    if (res.accessToken) {
      setSignupMessage(`Account created! Your accessToken: ${res.accessToken}`);
      localStorage.setItem("token", res.accessToken);
    } else {
      setSignupMessage("Signup failed: " + (res.message || "Unknown error"));
    }
  };

  const handleLogin = async () => {
    const res = await authAPI.login(email, password);
    if (res.accessToken) {
      setToken(res.accessToken);
      localStorage.setItem("token", res.accessToken);
    } else {
      alert("Login failed");
    }
  };

  const loadPlants = async () => {
    const res = await plantsAPI.getPlants(token);
    setPlants(res);
  };

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setPlants([]);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Plant Companion App</h1>

      {!token ? (
        <>
          <SignUp
            username={username}
            email={email}
            password={password}
            onUsernameChange={handleUsernameChange}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onSignup={handleSignup}
            signupMessage={signupMessage}
          />
          <hr />

          <Login
            email={email}
            password={password}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onLogin={handleLogin}
          />
        </>
      ) : (
        <>
          <div style={{ marginBottom: "20px" }}>
            <p>Welcome, {username || "User"}!</p>
            <p>Status: Logged in</p>
            <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
              Logout
            </button>
          </div>

          <div>
            <h2>Your Plants</h2>
            <button onClick={loadPlants} style={{ marginBottom: "10px" }}>
              Load Plants
            </button>

            {plants.length === 0 ? (
              <p>No plants loaded yet. Click "Load Plants" to see your plants.</p>
            ) : (
              <ul>
                {plants.map((plant) => (
                  <li key={plant._id}>{plant.name}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;