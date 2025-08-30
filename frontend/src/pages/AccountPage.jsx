import { Container, PageContainer } from "../styles/stylecomponents/StyledComponentsLibrary";
import Calender from "../components/calender";

const AccountPage = ({ token }) => {
  return (
    <Container>
      <PageContainer>
        <img className="plant-image my-plants-centered" src="/Eggplant.png" alt="Broccoli" />
        <h2>Mitt konto</h2>
        <p>Håll koll på dina att-göra-uppgifter här.</p>
        {/* Additional account management features can be added here */}
        <Calender token={token} />
      </PageContainer>
    </Container >
  );
}

export default AccountPage;