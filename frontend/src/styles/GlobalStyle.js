import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0px;
    box-sizing: border-box;
    outline: none;
    font-family: "Poppins", sans-serif;
  }

  html {
    scroll-behavior: smooth;
    font-size: 62.5%; /* 1rem = 10px */
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
  }

  /* Container för 3D-effekt som i din ursprungliga CSS */
  .container {
    width: 100%;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    display: grid;
    place-items: center;
    overflow: hidden;
    perspective: 100rem; /* 3D-effekt */
  }

  /* Gemensamma stilar för bilder */
  img {
    display: block;
    max-width: 100%;
    height: auto;
    border-radius: 10px;
  }

  /* Specifik klass för växtbilder */
  .plant-image {
    width: 200px;
    height: auto;
    border-radius: 10px;
      margin: 20px auto; // Ändra från margin-bottom till margin för att centrera
  display: block; // Lägg till denna rad
  }

  .my-plants-centered {
  display: block;
  margin-left: auto;
  margin-right: auto;
}



  /* Responsiv design */
  @media (max-width: 500px) {
    html {
      font-size: 55%;
    }
  }
`

export default GlobalStyle