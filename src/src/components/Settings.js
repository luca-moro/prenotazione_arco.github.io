import React, { useContext, useState } from "react"; 
import { AppContext } from "../AppContext"; 
import { FaBars } from "react-icons/fa";

const Settings = () => {
  const { 
    scheduleData, 
    setScheduleData, 
    handleSaveSettings, 
    isPopupEnabled: popupEnabled, 
    popupMessage, 
    handleUpdatePopupMessage: setPopupMessage, 
    handlePopupToggle: setPopupEnabled 
  } = useContext(AppContext);

  const [updatedData, setUpdatedData] = useState(scheduleData); 
  const [selectedDay, setSelectedDay] = useState(Object.keys(scheduleData.days)[0]); 
  const [updatedPopupEnabled, setUpdatedPopupEnabled] = useState(popupEnabled);
  const [updatedPopupMessage, setUpdatedPopupMessage] = useState(popupMessage);
  const [menuOpen, setMenuOpen] = useState(false);
  const { links, setLinks } = useContext(AppContext); // Usa i link dal Context
  
  const handleEditLink = (index, key, newValue) => {
    const updatedLinks = [...links];
    updatedLinks[index][key] = newValue;
    setLinks(updatedLinks); // Aggiorna i link nel Context
  };
     

  const toggleSlotSuspension = (day, slotIndex) => {
    const updatedSlots = updatedData.days[day].slots.map((slot, index) =>
      index === slotIndex ? { ...slot, isSuspended: !slot.isSuspended } : slot
    );
    handleUpdate(day, "slots", updatedSlots);
  };

  const handleUpdate = (day, key, value) => {
    const updatedDay = { ...updatedData.days[day], [key]: value };
    setUpdatedData({ ...updatedData, days: { ...updatedData.days, [day]: updatedDay } });
  };

  const handleSlotUpdate = (day, slotIndex, field, value) => {
    const updatedSlots = updatedData.days[day].slots.map((slot, index) =>
      index === slotIndex ? { ...slot, [field]: value } : slot
    );
    handleUpdate(day, "slots", updatedSlots);
  };

  const handleSave = () => {
    const changes = [];
    Object.keys(scheduleData.days).forEach((day) => {
      const translatedDay = daysInItalian[day] || day; // Traduci il giorno
      const originalDay = scheduleData.days[day];
      const updatedDay = updatedData.days[day];

      if (originalDay.trainer !== updatedDay.trainer) {
        changes.push(`${translatedDay}: Allenatore cambiato da "${originalDay.trainer}" a "${updatedDay.trainer}"`);
      }
      if (originalDay.location !== updatedDay.location) {
        changes.push(`${translatedDay}: Luogo cambiato da "${originalDay.location}" a "${updatedDay.location}"`);
      }

      updatedDay.slots.forEach((slot, index) => {
        const originalSlot = originalDay.slots[index];
        if (slot.time !== originalSlot.time) {
          changes.push(`${translatedDay}, Turno ${index + 1}: Orario cambiato da "${originalSlot.time}" a "${slot.time}"`);
        }
        if (slot.reserve !== originalSlot.reserve) {
          changes.push(`${translatedDay}, Turno ${index + 1}: Riservato il turno "${originalSlot.reserve}" a "${slot.reserve}"`);
        }
        if (slot.capacity !== originalSlot.capacity) {
          changes.push(`${translatedDay}, Turno ${index + 1}: Capacità cambiata da "${originalSlot.capacity}" a "${slot.capacity}"`);
        }
        if (slot.isSuspended !== originalSlot.isSuspended) {
          changes.push(
            `${translatedDay}, Turno ${index + 1}: Stato cambiato a "${
              slot.isSuspended ? "Sospeso" : "Attivo"
            }"`
          );
        }
      });
    });

    if (updatedPopupEnabled !== popupEnabled) {
      changes.push(`Popup: Stato cambiato a "${updatedPopupEnabled ? "Attivo" : "Disattivo"}"`);
    }
    if (updatedPopupMessage !== popupMessage) {
      changes.push(`Popup: Messaggio aggiornato da "${popupMessage}" a "${updatedPopupMessage}"`);
    }

    if (changes.length > 0) {
      const confirmation = window.confirm(
        `Hai apportato le seguenti modifiche:\n\n${changes.join("\n")}\n\nVuoi salvare le modifiche?`
      );
      if (confirmation) {
        setScheduleData(updatedData);
        setPopupEnabled(updatedPopupEnabled);
        setPopupMessage(updatedPopupMessage);
        handleSaveSettings(updatedData);
      }
    } else {
      alert("Nessuna modifica apportata.");
      handleSaveSettings(updatedData);
    }
  };

  const handleClearParticipants = (day, slotIndex) => {
    const updatedSlots = updatedData.days[day].slots.map((slot, index) =>
      index === slotIndex ? { ...slot, participants: [] } : slot
    );
    handleUpdate(day, "slots", updatedSlots);
  };

  const daysInItalian = {
    Monday: "Lunedì",
    Tuesday: "Martedì",
    Wednesday: "Mercoledì",
    Thursday: "Giovedì",
    Friday: "Venerdì",
    Saturday: "Sabato",
    Sunday: "Domenica"
  };

  return (
    <div 
      style={{
        position: "relative",
        minHeight: '100vh',
      }}
    >
      <div 
        style={{
          position: "absolute",
          top: -10,
          left: -10,
          width: "110%",
          height: "105%",
          backgroundColor: "rgba(0, 0, 0, 1)",
          zIndex: 0,
        }}
      />
     <div>
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
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 4,
          }}
        >
          {links.map((link, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#f6a200",
                  textDecoration: "none",
                  display: "block",
                  marginBottom: "10px",
                  padding: "5px",
                  border: "1px solid #f6a200",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                {link.label || "Apri link"}
              </a>
              <input
                type="text"
                value={link.label}
                onChange={(e) => handleEditLink(index, "label", e.target.value)}
                style={{
                  marginBottom: "5px",
                  width: "100%",
                  padding: "5px",
                  borderRadius: "5px",
                  border: "1px solid #f6a200",
                  backgroundColor: "black",
                  color: "#f6a200",
                }}
                placeholder="Etichetta"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => handleEditLink(index, "url", e.target.value)}
                style={{
                  width: "100%",
                  padding: "5px",
                  borderRadius: "5px",
                  border: "1px solid #f6a200",
                  backgroundColor: "black",
                  color: "#f6a200",
                }}
                placeholder="URL"
              />
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          backgroundSize: 'cover',
          padding: '20px',
          minHeight: '50vh',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h1 className="mb-4" style={{ marginTop: '-20px', color: "#f6a200", }}>Impostazioni</h1>


        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto' }}>
          {Object.keys(updatedData.days).map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                padding: '10px 20px',
                backgroundColor: selectedDay === day ? '#FFA500' : '#ccc',
                color: 'black',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {daysInItalian[day]}
            </button>
          ))}
        </div>

        {selectedDay && updatedData.days[selectedDay] && (
          <div>
            <div style={{ backgroundColor: '#FFA500', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
              <h3>{daysInItalian[selectedDay]}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label className="block mb-2">
                  Allenatore:
                  <input
                    type="text"
                    value={updatedData.days[selectedDay].trainer || ''}
                    onChange={(e) => handleUpdate(selectedDay, 'trainer', e.target.value)}
                    className="ml-2 p-1 rounded border"
                  />
                </label>
                <label className="block mb-2">
                  Luogo:
                  <input
                    type="text"
                    value={updatedData.days[selectedDay].location || ''}
                    onChange={(e) => handleUpdate(selectedDay, 'location', e.target.value)}
                    className="ml-2 p-1 rounded border"
                  />
                </label>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFA500', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
              <h3>Popup Avvisi </h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={updatedPopupEnabled}
                  onChange={(e) => setUpdatedPopupEnabled(e.target.checked)}
                  className="form-checkbox"
                />
                <span>Attiva popup</span>
              </label>
              <br />
              {updatedPopupEnabled && (
                <div className="mt-2">
                  <label className="block">
                    Messaggio del popup:
                    <input
                      type="text"
                      value={updatedPopupMessage || ''}
                      onChange={(e) => setUpdatedPopupMessage(e.target.value)}
                      className="mt-1 block w-full rounded border p-2"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded">
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  flexWrap: 'nowrap',
                  flexDirection: 'row',
                  position: 'relative',
                  justifyContent: 'space-between',
                }}
              >
                {updatedData.days[selectedDay].slots.map((slot, index) => (   
                  <div
                    key={index}
                    style={{
                      flex: '1 1 calc(33% - 20px)',
                      
                      padding: '8px',
                      backgroundColor: '#FFA500',
                      borderRadius: '8px',
                      marginBottom: '-15px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <h3>Turno {index + 1}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label className="block mb-2" htmlFor={`reserve-${index}`}>
                        Riserva:
                        <input
                          id={`reserve-${index}`}
                          type="text"
                          value={slot.reserve || ''}
                          onChange={(e) => handleSlotUpdate(selectedDay, index, 'reserve', e.target.value)}
                          className="ml-2 p-1 rounded border"
                        />
                      </label>
                      <label className="block mb-2" htmlFor={`time-${index}`}>
                        Orario:
                        <input
                          id={`time-${index}`}
                          type="text"
                          value={slot.time || ''}
                          onChange={(e) => handleSlotUpdate(selectedDay, index, 'time', e.target.value)}
                          className="ml-2 p-1 rounded border"
                        />
                      </label>
                      <label className="block mb-4" htmlFor={`capacity-${index}`}>
                        Capacità:
                        <input
                          id={`capacity-${index}`}
                          type="number"
                          min="0"
                          value={slot.capacity || ''}
                          onChange={(e) => handleSlotUpdate(selectedDay, index, 'capacity', e.target.value)}
                          className="ml-2 p-1 rounded border"
                        />
                      </label>
                    </div>
                    <div style={{ marginTop: '20px', display: 'block',  gap: '8px' }}>
                    <button
                      onClick={() => handleClearParticipants(selectedDay, index)}
                      style={{
                        backgroundColor: "red",
                        color: "yellow",
                        border: 'none',
                        cursor: 'pointer',
                        marginLeft: '5px',
                        padding: "2px 6px", // Dimensiona correttamente il bottone attorno al testo
                        borderRadius: "6px",
                        fontSize: "14px", // Dimensione del testo regolabile
                        display: "block", // Impedisce che il bottone occupi tutta la larghezza
                        textAlign: "center", // Allinea il testo
                        marginTop: "0px",
                        marginBottom: "5px",
                      }}
                   >
                     Cancella Tutti Iscritti
                    </button>
                      <button
                        onClick={() => toggleSlotSuspension(selectedDay, index)}
                        style={{
                          padding: '2px 6px',
                          backgroundColor: slot.isSuspended ? '#dc3545' : '#28a745',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          marginTop: "20px",
                          marginLeft: '25px',
                          borderRadius: '6px',
                          fontSize: "14px", 
                          display: "block", // Posiziona il bottone a sinistra
                        }}
                      >
                        {slot.isSuspended ? 'Riattiva turno' : 'Sospendi turno'}
                      </button>
                    </div>
                  </div>
                ))}

<button
                  onClick={handleSave}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    padding: '15px 20px',
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    position: 'absolute',
                    bottom: '-80px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  Salva Modifiche
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

