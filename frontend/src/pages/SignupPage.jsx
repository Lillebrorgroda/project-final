import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authAPI from "../api/auth";

const SignupPage = ({ setToken, setUsername }) => {
  const [username, setUsernameLocal] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const res = await authAPI.signup(username, email, password);
    if (res.accessToken) {
      setMessage("Konto skapat!");
      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("username", username);
      setToken(res.accessToken);
      setUsername(username);
      navigate("/search");
    } else {
      setMessage("Registrering misslyckades: " + (res.message || "Okänt fel"));
    }
  };

  return (
    <div className="signup">
      <h2>Registrera dig</h2>
      <input
        type="text"
        placeholder="Användarnamn"
        value={username}
        onChange={(e) => setUsernameLocal(e.target.value)}
      />
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
      <button onClick={handleSignup}>Registrera</button>
      <p>{message}</p>
    </div>
  );
};

export default SignupPage;
