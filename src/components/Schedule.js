import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../AppContext";
import { FaCog, FaBars } from "react-icons/fa"; 
import arcoImage from "../assets/arco.jpg";
import logo from "../assets/logo.png";


const dayTranslations = {
  Monday: "Lunedì",
  Tuesday: "Martedì",
  Wednesday: "Mercoledì",
  Thursday: "Giovedì",
  Friday: "Venerdì",
  Saturday: "Sabato",
  Sunday: "Domenica",
};

const Schedule = ({ onOpenSettings }) => {
  const { 
    scheduleData, 
    setScheduleData, 
    isPopupEnabled, 
    popupMessage, 
    handlePopupToggle 
  } = useContext(AppContext);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [fontSize, setFontSize] = useState("18px");
  const [menuOpen, setMenuOpen] = useState(false);
  const { links } = useContext(AppContext);

  const getDayNumber = (day) => {
    const currentDate = new Date();
    const dayMapping = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 0,
    };
    const dayIndex = dayMapping[day];
    const currentDayIndex = currentDate.getDay();
    const daysDifference = (dayIndex - currentDayIndex + 7) % 7;
    currentDate.setDate(currentDate.getDate() + daysDifference);
    return currentDate.getDate();
  };

  useEffect(() => {
    const updateScheduleWithDayNumbers = () => {
      const updatedData = { ...scheduleData };
      Object.keys(updatedData.days).forEach((day) => {
        if (["Monday", "Wednesday", "Thursday", "Saturday"].includes(day)) {
          const dayNumber = getDayNumber(day);
          updatedData.days[day].dayNumber = dayNumber;
        }
      });
      setScheduleData(updatedData);
    };

    updateScheduleWithDayNumbers();
  }, [scheduleData, setScheduleData]);
  


  const handleSignUp = (day, slotIndex, name) => {
    if (name.trim() === "") {
      alert("Inserisci un nome valido!");
      return;
    }
    const updatedData = { ...scheduleData };
    const slot = updatedData.days[day].slots[slotIndex];
    if (slot.isSuspended) {
      alert("Questo turno è sospeso!");
      return;
    }
    if (slot.participants.length < slot.capacity) {
      slot.participants.push(name);
      setScheduleData(updatedData);
      alert(`L'arciere ${name} è stato correttamente iscritto al Turno !! Buon Allenamento !!`);
    } else {
      alert("Turno completo!");
    }
  };

  const handleRemoveParticipant = (day, slotIndex, participantIndex) => {
    const updatedData = { ...scheduleData };
    const slot = updatedData.days[day].slots[slotIndex];
    const participantName = slot.participants[participantIndex];

    if (slot.isSuspended) {
      alert("Non puoi modificare un turno sospeso!");
      return;
    }

    const confirmation = window.confirm(`Sei sicuro di voler CANCELLARE ${participantName} dagli allenamenti?`);
    
    if (confirmation) {
      slot.participants.splice(participantIndex, 1);
      setScheduleData(updatedData);
    }
  };


  return (
    <div
      style={{
        position: "relative",
        backgroundImage: `url(${arcoImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        marginLeft: "-10px",
        marginRight: "-12px",
        marginTop: "-10px",
        marginBottom: "-10px",
        padding: "10px",
        color: "black",
        fontFamily: "Times New Roman, serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          position: "absolute",
          top: "0px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            maxWidth: "100px",
            height: "auto",
            display: "inline-block",
            marginBottom: "-60px",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: "0px",
          left: 0,
          right: 0,
          height: "calc(20% - 18px)",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 1,
        }}
      ></div>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "transparent",
          border: "none",
          color: "#f6a200",
          fontSize: "30px",
          cursor: "pointer",
          zIndex: 3,
        }}
      >
        <FaBars />
      </button>

      {menuOpen && (
        <div
        style={{
          position: "absolute",
          top: "40px",
          right: "10px",
          backgroundColor: "black",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          zIndex: 4,
        }}
        >  
        <div>
        <h1>Links</h1>
<ul>
  {links.map((link, index) => (
    <li key={index} style={{ marginBottom: "10px" }}>
      <a 
        href={link.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ color: "#f6a200", width: "120%", marginLeft: "-40px", textAlign: "center", padding: "5px", marginTop: "10px", marginBottom: "5px", justifyContent: "center", fontWeight: "bold", border: "1px solid #f6a200", borderRadius: "5px", display: "block" }}
      >
        {link.label || "Apri link"}
      </a>
    </li>
  ))}
</ul>

        </div>
      </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "5px",
          marginBottom: "35px",
          zIndex: 2,
          marginTop: "60px",
          position: "relative",
        }}
      >
        {Object.keys(scheduleData.days).map((day) => {
          const dayNumber = scheduleData.days[day].dayNumber || getDayNumber(day);
          return (
            <button
              key={day}
              onClick={() => {
                setSelectedDay(day);
                setFontSize("22px");
              }}
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                backgroundColor: "transparent",
                color: "#f6a200",
                border: "none",
                position: "relative",
                fontSize: selectedDay === day ? fontSize : "16px",
              }}
            >
              {`${dayTranslations[day]}  ${dayNumber}`}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "5px",
                  backgroundColor: selectedDay === day ? "#f6a200" : "transparent",
                }}
              ></div>
            </button>
          );
        })}
      </div>

      <div
        style={{
          backgroundColor: "#f6a200",
          padding: "1px 13px",
          borderRadius: "10px",
          marginTop: "15px",
          marginBottom: "10px",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
        }}
      >
        <h2 style={{ marginBottom: "-10px" }}>{dayTranslations[selectedDay]}</h2>
        <p style={{ marginBottom: "-10px" }}>
          <u><strong>Allenatore:</strong></u> {scheduleData.days[selectedDay].trainer}
        </p>
        <p style={{ marginBottom: "28px" }}>
          <u><strong>Luogo:</strong></u> {scheduleData.days[selectedDay].location}
        </p>
        {scheduleData.banners[selectedDay] && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            {scheduleData.banners[selectedDay]}
          </p>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          zIndex: 2,
        }}
      >
        {scheduleData.days[selectedDay].slots.map((slot, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#f6a200",
              padding: "14px",
              borderRadius: "10px",
            }}
          >
            <h3>Turno {index + 1}</h3>
            <h4 style={{ marginTop: "-18px", marginBottom: "-15px", fontSize: '22px', color: '#ff0000' }}>{slot.reserve}</h4>
            <h5 style={{ marginTop: "15px", marginBottom: "-13px", fontSize: '18px', color: 'black' }}>{slot.time}</h5>
           

              
            {slot.isSuspended ? (
              <p style={{ color: "red", fontWeight: "bold" }}>Turno sospeso</p>
            ) : (
              <>
                <p>
                  <u><strong>Posti disponibili:</strong></u>{" "}
                  <strong>{slot.capacity - slot.participants.length}</strong>
                </p>
                <ul style={{ paddingLeft: "20px" }}>
                  {slot.participants.map((participant, i) => (
                    <li
                      key={i}
                      style={{ marginBottom: "5px", display: "flex", alignItems: "center" }}
                    >
                      {participant}
                      <button
                        onClick={() =>
                          handleRemoveParticipant(selectedDay, index, i)
                        }
                        style={{
                          marginLeft: "10px",
                          color: "black",
                          backgroundColor: "red",
                          border: "none",
                          borderRadius: "50%",
                          width: "15px",
                          height: "15px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: "10px",
                          lineHeight: "1",
                        }}
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <input
                    type="text"
                    placeholder="Inserisci il nome"
                    id={`name-input-${selectedDay}-${index}`}
                    style={{ padding: "5px", width: "90%" }}
                  />
                  <button
                    onClick={() =>
                      handleSignUp(
                        selectedDay,
                        index,
                        document.getElementById(`name-input-${selectedDay}-${index}`).value
                      )
                    }
                    style={{
                      backgroundColor: "#388e3c",
                      color: "white",
                      border: "none",
                      padding: "8px",
                      marginLeft: "28px",
                      marginRight: "28px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      textAlign: "center",
                      fontSize: "14px",
                    }}
                  >
                    Prenota
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onOpenSettings(prompt("Inserisci la password:"))}
        style={{
          marginTop: "40px",
          padding: "10px",
          backgroundColor: "black",
          color: "#f6a200",
          border: "none",
          borderRadius: "40%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <FaCog style={{ fontSize: "30px" }} />
      </button>

      {isPopupEnabled && popupMessage && (
  <div style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "red", // Cambiato in rosso
    padding: "20px",
    borderRadius: "10px",
    zIndex: 1000,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "80%",
    width: "400px",
    textAlign: "center"
  }}>
    <h3 style={{ 
      marginTop: 0, 
      color: "black",
      fontSize: "40px",
      fontWeight: "bold" // Aggiunto grassetto
    }}>
      Comunicazione Importante
    </h3>
    <p style={{ 
      color: "black", 
      fontSize: "30px", 
      marginBottom: "20px",
      fontWeight: "bold" // Aggiunto grassetto
    }}>
      {popupMessage}
    </p>
    <button 
      onClick={handlePopupToggle}
      style={{
        backgroundColor: "black",
        color: "#f6a200",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold" // Aggiunto grassetto anche al bottone
      }}
    >
      Chiudi
    </button>
  </div>
)}
    </div>
  );
};

export default Schedule;