import { Link } from "react-router";
import { FullscreenWrapper, PageWrapper } from "../styles/components/Layout.styles";
import { PrimaryButton, ButtonGroup } from "../styles/components/Button.styles";

const LandingPage = () => {
  return (
    <main>
      <FullscreenWrapper>
        <PageWrapper>
          <img className="plant-image" src="/Broccoli.jpg" alt="Broccoli" />
          <h1>Välkommen till Trädgården</h1>
          <p>Din digitala följeslagare för växtvård och planering.</p>
          <p>Vill du:</p>
          <ButtonGroup>
            <Link to="/login"><PrimaryButton>Logga in</PrimaryButton></Link>
            <Link to="/signup"><PrimaryButton>Registrera dig</PrimaryButton></Link>
            <Link to="/search"><PrimaryButton>Sök växt</PrimaryButton></Link>
          </ButtonGroup>
        </PageWrapper>
      </FullscreenWrapper>
    </main>
  )
}


export default LandingPage;