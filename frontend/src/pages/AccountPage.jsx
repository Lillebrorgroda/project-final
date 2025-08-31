import Calender from "../components/calender";
import { FullscreenWrapper, PageWrapper } from "../styles/components/Layout.styles";

const AccountPage = ({ token }) => {
  return (
    <FullscreenWrapper>
      <PageWrapper>
        <img className="plant-image my-plants-centered" src="/Eggplant.png" alt="Broccoli" />
        <h2>Mitt konto</h2>
        <p>Håll koll på dina att-göra-uppgifter här.</p>
        {/* Additional account management features can be added here */}
        <Calender token={token} />
      </PageWrapper>
    </FullscreenWrapper >
  );
}

export default AccountPage;