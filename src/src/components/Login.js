import React, { useState } from "react";
import logo from "../assets/logo.png";

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setError("La password è obbligatoria.");
      return;
    }
    setError(""); // Reset error
    onLogin(password);
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>Accedi</h1>
        <input
          type="password"
          placeholder="Inserisci la password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>
          Accedi
        </button>
      </form>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#f6a200", // Sfondo arancio per tutta la pagina
    width: "100vw", // Copre tutta la larghezza
    height: "100vh", // Copre tutta l'altezza del viewport
    display: "flex",
    justifyContent: "center", // Centra il contenuto orizzontalmente
    alignItems: "center", // Centra il contenuto verticalmente
    margin: -8, // Elimina margini
    padding: -8, // Elimina padding
    boxSizing: "border-box", // Evita sporgenze
    overflow: "hidden", // Nasconde eventuali elementi fuori dal viewport
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    borderRadius: "8px",
    backgroundColor: "#000", // Sfondo nero per il riquadro
    color: "#f6a200", // Testo arancio all'interno del riquadro
    width: "100%",
    maxWidth: "320px", // Larghezza adattata per smartphone
    height: "420px", // Altezza proporzionata
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Ombra del riquadro
  },
  logo: {
    width: "130px", // Logo più grande
    marginBottom: "1.5rem", // Spazio sotto il logo
  },
  title: {
    marginBottom: "1rem",
    fontSize: "1.4rem", // Testo leggermente più grande
    color: "#f6a200", // Testo arancio per il titolo
    textAlign: "center",
  },
  input: {
    padding: "0.4rem", // Campo più piccolo
    marginBottom: "1rem",
    width: "70%", // Ridotto di dimensioni
    borderRadius: "4px",
    border: "none",
    fontSize: "0.9rem",
  },
  error: {
    color: "red",
    fontSize: "0.8rem",
    marginBottom: "1rem",
  },
  button: {
    padding: "0.4rem 1rem", // Dimensioni del bottone
    backgroundColor: "#f6a200", // Bottone arancio
    border: "none",
    borderRadius: "4px",
    fontSize: "0.9rem",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#000", // Colore del testo nero
    alignSelf: "center",
  },
};

export default Login;
