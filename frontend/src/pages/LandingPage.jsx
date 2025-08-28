import { Link } from "react-router";
import { Container, PageContainer, ButtonGroup, PrimaryButton } from "../styles/stylecomponents/StyledComponentsLibrary"

const LandingPage = () => {
  return (
    <Container>
      <PageContainer>
        <img className="plant-image" src="/Broccoli.jpg" alt="Broccoli" />
        <h1>Välkommen till Trädgården</h1>
        <p>Din digitala följeslagare för växtvård och planering.</p>
        <p>Vill du:</p>
        <ButtonGroup>
          <Link to="/login"><PrimaryButton>Logga in</PrimaryButton></Link>
          <Link to="/signup"><PrimaryButton>Registrera dig</PrimaryButton></Link>
          <Link to="/search"><PrimaryButton>Sök växt</PrimaryButton></Link>
        </ButtonGroup>
      </PageContainer>
    </Container>
  )
}


export default LandingPage;