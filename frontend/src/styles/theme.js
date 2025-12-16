const theme = {
  colors: {
    primary: "#4CAF50",
    primaryHover: "#45a049",
    secondary: "#464E4B",
    background: "#Fff",
    backgroundAlt: "#fff",
    text: "#0C0D0D",
    textLight: "#0a1511",
    border: "#ddd",
    shadow: "rgba(0, 0, 0, 0.1)",
    disabled: "rgba(0, 0, 0, 0.5)"
  },

  fonts: {
    body: "'Poppins', sans-serif",
    heading: "'Poppins', sans-serif",
  },

  spacing: (factor) => `${factor * 8}px`,

  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1024px"
  },

  // Gemensamma stilar för återanvändning
  components: {
    button: {
      padding: "15px 20px",
      border: "none",
      borderRadius: "5px",
      transition: "background-color 0.3s ease",
      margin: "10px"
    },
    input: {
      padding: "10px",
      margin: "5px 0",
      border: "1px solid #ddd",
      borderRadius: "5px"
    },
    image: {
      width: "200px",
      height: "auto",
      borderRadius: "10px",
      marginBottom: "20px"
    },
    icon: {
      fontSize: "24px",
      margin: "0 10px",
      cursor: "pointer",
      transition: "color 0.3s ease"
    }
  }
}

export default theme