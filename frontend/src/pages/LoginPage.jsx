import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authAPI from "../api/auth";
import { Container, PageContainer, PrimaryButton, StyledInput } from "../styles/stylecomponents/StyledComponentsLibrary";

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
      alert("Inloggning misslyckades"); // Change to a toast
    }
  };

  return (
    <Container>
      <PageContainer>
        <img className="plant-image" src="/Broccoli.jpg" alt="Broccoli" />
        <h2>Logga in</h2>
        <StyledInput
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <StyledInput
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PrimaryButton onClick={handleLogin}>Logga in</PrimaryButton>
      </PageContainer>
    </Container>
  );
};

export default LoginPage;
