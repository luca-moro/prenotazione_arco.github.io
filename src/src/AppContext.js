import React, { createContext, useState } from "react";

// Creazione del contesto
export const AppContext = createContext();

// Provider del contesto
export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPopupEnabled, setIsPopupEnabled] = useState(false); // Stato per abilitare/disabilitare il popup
  const [popupMessage, setPopupMessage] = useState(""); // Messaggio del popup

  const [links, setLinks] = useState([
    {
      label: "File Segnapunti Scaricabile",
      url: "https://drive.google.com/open?id=1SLwyMp_1ehJcxldMwiQ1e8nUmTS84HZq",
    },
    {
      label: "Calendario Tecnici",
      url: "https://docs.google.com/spreadsheets/d/11_P5Tp79USRnDzy4NDw_2u3zsvyeaU33LsEISs46uKs/edit?usp=share_link",
    },
    {
      label: "File Gare",
      url: "https://docs.google.com/spreadsheets/d/1eO8TQW-4I0wmI7VCpdxiNsQRAAzB5lsx/edit?gid=1333899302#gid=1333899302",
    },
    {
      label: "",
      url: "",
    },
    {
      label: "",
      url: "",
    },
  ]);

  const [scheduleData, setScheduleData] = useState({
    days: {
      Monday: {
        trainer: "Allenatore 1",
        location: "Luogo 1",
        slots: [
          { time: "10:00-12:00", capacity: 10, participants: [], isActive: true },
          { time: "16:00-18:00", capacity: 10, participants: [], isActive: true },
        ],
      },
      Wednesday: {
        trainer: "Allenatore 2",
        location: "Luogo 2",
        slots: [
          { time: "10:00-12:00", capacity: 10, participants: [], isActive: true },
          { time: "16:00-18:00", capacity: 10, participants: [], isActive: true },
        ],
      },
      Thursday: {
        trainer: "Allenatore 3",
        location: "Luogo 3",
        slots: [
          { time: "10:00-12:00", capacity: 10, participants: [], isActive: true },
          { time: "16:00-18:00", capacity: 10, participants: [], isActive: true },
        ],
      },
      Saturday: {
        trainer: "Allenatore 4",
        location: "Luogo 4",
        slots: [
          { time: "10:00-12:00", capacity: 10, participants: [], isActive: true },
          { time: "16:00-18:00", capacity: 10, participants: [], isActive: true },
        ],
      },
    },
    banners: {
      Monday: "",
      Wednesday: "",
      Thursday: "",
      Saturday: "",
    },
  });

  const handleLogin = (password) => {
    if (password === "arcieri") {
      setIsLoggedIn(true);
    } else {
      alert("Password errata");
    }
  };

  const handleOpenSettings = (password) => {
    if (password === "impostazioni") {
      setIsSettingsOpen(true);
    } else {
      alert("Password errata per accedere alle impostazioni");
    }
  };

  const handleSaveSettings = (updatedData) => {
    setScheduleData(updatedData);
    setIsSettingsOpen(false);
  };

  // Funzione per abilitare/disabilitare il popup
  const handlePopupToggle = () => {
    setIsPopupEnabled(!isPopupEnabled);
  };

  // Funzione per aggiornare il messaggio del popup
  const handleUpdatePopupMessage = (message) => {
    setPopupMessage(message);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        isSettingsOpen,
        isPopupEnabled,  // Aggiunto stato per popup
        scheduleData,
        setScheduleData,
        handleLogin,
        handleOpenSettings,
        handleSaveSettings,
        popupMessage,
        handleUpdatePopupMessage,  // Funzione per aggiornare il messaggio del popup
        handlePopupToggle,  // Funzione per attivare/disattivare popup
        links,
        setLinks, // Aggiunto setLinks
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
