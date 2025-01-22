import React, { useContext } from "react";
import { AppProvider, AppContext } from "./AppContext";
import Schedule from "./components/Schedule";
import Settings from "./components/Settings";
import Login from "./components/Login";

const App = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Errore: AppContext non trovato</div>;
  }

  const { isLoggedIn, isSettingsOpen, handleLogin, handleOpenSettings } =
    context;

  return (
    <div>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : isSettingsOpen ? (
        <Settings />
      ) : (
        <Schedule onOpenSettings={handleOpenSettings} />
      )}
    </div>
  );
};

// Wrappare l'app con il provider
const Root = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

export default Root;
