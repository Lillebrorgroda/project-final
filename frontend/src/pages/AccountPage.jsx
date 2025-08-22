import { useNavigate } from "react-router-dom";

const AccountPage = () => {
  const navigate = useNavigate()
  return (
    <div className="account-page">
      <i className="bx bx-chevron-left" onClick={() => navigate("/")}></i>
      <img src="/Broccoli.jpg" alt="Broccoli" />
      <h2>Mitt konto</h2>
      <p>Här kan du hantera dina växter och inställningar.</p>
      {/* Additional account management features can be added here */}
    </div>
  );
}

export default AccountPage;