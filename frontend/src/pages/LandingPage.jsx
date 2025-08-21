import { Link } from "react-router";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <img src="/Broccoli.jpg" alt="Broccoli" />
      <h1>Välkommen till Trädgården</h1>
      <p>Din digitala följeslagare för växtvård och planering.</p>
      <p>Vill du:</p>
      <div className="landing-buttons">
        <Link to="/login"><button>Logga in</button></Link>
        <Link to="/signup"><button>Registrera dig</button></Link>
        <Link to="/search"><button>Sök växt</button></Link>
      </div>
    </div>
  )
}


export default LandingPage;