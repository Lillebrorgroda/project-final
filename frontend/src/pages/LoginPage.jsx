import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authAPI from "../api/auth";

const LoginPage = ({ setToken, setUsername }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await authAPI.login(email, password);
    if (res.accessToken) {
      setToken(res.accessToken);
      const name = res.username || "User";
      setUsername(name);
      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("username", name);
      navigate("/search");
    } else {
      alert("Inloggning misslyckades");
    }
  };

  return (
    <div className="login">
      <img src="/Broccoli.jpg" alt="Broccoli" />
      <h2>Logga in</h2>
      <input
        type="email"
        placeholder="E-post"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Logga in</button>
    </div>
  );
};

export default LoginPage;
