import React, { useContext } from "react";
import { AppContext } from "./AppContext";

const MyComponent = () => {
  const { currentView, goToSchedule } = useContext(AppContext);

  return (
    <div>
      {currentView === "settings" && (
        <button onClick={goToSchedule}>Torna al Programma</button>
      )}

      {currentView === "schedule" && <p>Questa è la vista del Programma</p>}
    </div>
  );
};

export default MyComponent;
