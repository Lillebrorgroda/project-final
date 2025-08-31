import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authAPI from "../api/auth";
import { FullscreenWrapper, PageWrapper } from "../styles/components/Layout.styles";
import { PrimaryButton } from "../styles/components/Button.styles";
import { StyledInput } from "../styles/components/Form.styles";

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
    <FullscreenWrapper>
      <PageWrapper>
        <img className="plant-image" src="/Broccoli.jpg" alt="Broccoli" />
        <h2>Logga in</h2>
        <StyledInput
          type="email"
          aria-label="email"
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
        <PrimaryButton onClick={handleLogin}>Logga in</PrimaryButton>
      </PageWrapper>
    </FullscreenWrapper>
  );
};

export default LoginPage;
