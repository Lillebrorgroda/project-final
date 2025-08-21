/** Söka växt klart
 * Spara växt i databasen på min sida
 * Visa växt på min sida
 * Visa växt på min sida i en lista
 * Visa växt på min sida i en lista med bild
 * Visa växt på min sida i en lista med bild och namn
 * Visa växt på min sida i en lista med bild, namn och beskrivning
 * kunna ta bort växt från min sida
 * kunna ta bort växt från min sida med en knapp
 * kunna ta bort växt från min sida med en knapp och bekräftelse
 * kunna ta bort växt från min sida med en knapp, bekräftelse och animation
 * 
 * 
 */

/** spara funktionen måste vara kopplad till mitt konto. När jag hittat en växt ska jag kunna spara den till mitt konto. mitt konto måste kunna bygga upp information om saker jag sparar.  
 * 
 *
*/
import { useNavigate } from "react-router-dom";

import PlantList from "../components/PlantList"




const AccountPage = () => {

  const navigate = useNavigate();
  return (
    <div className="account-page">
      <i className="bx bx-chevron-left" onClick={() => navigate("/")}></i>
      <img src="/Broccoli.jpg" alt="Broccoli" />
      <h2>Mina växter</h2>
      <PlantList />
    </div>
  )
}
export default AccountPage