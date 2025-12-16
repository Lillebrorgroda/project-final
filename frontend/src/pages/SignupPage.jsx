import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authAPI from "../api/auth";
import { StyledInput } from "../styles/components/Form.styles"
import { FullscreenWrapper, PageWrapper } from "../styles/components/Layout.styles";
import { PrimaryButton } from "../styles/components/Button.styles";


//Add a loading state

const SignupPage = ({ setToken, setUsername }) => {
  const [username, setUsernameLocal] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false)
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
  }

  return (
    <main>
      <FullscreenWrapper>
        <PageWrapper>
          <i className="bx bx-chevron-left" onClick={() => navigate("/")} style={{ cursor: "pointer" }}></i>
          <img className="plant-image" src="/Broccoli.jpg" alt="Broccoli" />
          <h2>Registrera dig</h2>
          <StyledInput
            type="text"
            aria-label="Användarnamn"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsernameLocal(e.target.value)}
          />
          <StyledInput
            type="email"
            aria-label="e-post"
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <StyledInput
            type="password"
            aria-label="lösenord"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PrimaryButton onClick={handleSignup}>Registrera</PrimaryButton>
          <p>{message}</p>
        </PageWrapper>
      </FullscreenWrapper>
    </main>
  )
}

export default SignupPage;
