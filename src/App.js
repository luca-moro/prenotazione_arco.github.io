import { useMemo, useState, useEffect } from "react";
import { Calendar, X, Pause, Plus, Minus } from "lucide-react";
import { initializeApp } from 'firebase/app';
import { getFirestore, updateDoc } from 'firebase/firestore';
import { collection, doc, getDocs, setDoc, addDoc, getDoc } from "firebase/firestore";
import { getDatabase, ref, onValue, set, push } from 'firebase/database';
import React from "react";
import "./App.css";
import logo from "./logo192.png"; // Import the logo image

const firebaseConfig = {
  apiKey: "AIzaSyARiqtsVR7cmX6iU3cD0P7LvvWfp4zv4To",
  authDomain: "prenotazione-arco.firebaseapp.com",
  projectId: "prenotazione-arco",
  storageBucket: "prenotazione-arco.firebasestorage.app",
  messagingSenderId: "308635909661",
  appId: "1:308635909661:web:ea5396b2903d880f30d0f4",
  databaseURL: "https://prenotazione-arco-default-rtdb.europe-west1.firebasedatabase.app" // Updated URL
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);

async function updateGiorniDocument(newData) {
  // Reference the specific document you want to update
  const docRef = doc(db, 'giorni', '5h6XEaykZl2USUmmcb6U');
  const updateData = {
    campo: '{"lista":'+JSON.stringify(newData)+'}'
  }

  try {
    // Update the document with the new data
    await updateDoc(docRef, updateData);
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

interface Prenotazione {
  nome: string;
  giorno: string;
  turno: string;
}

interface Giorno {
  nome: string;
  turni: {
    nome: string;
    posti: number;
    prenotazioni: Prenotazione[];
    sospeso: boolean;
  }[];
}

const initialData = {
    'Lunedì':{
      nome: "Lunedì",
      turni: [
        { nome: "Primo turno", posti: 20, prenotazioni: [{nome:"LLLL"}], sospeso: false },
        { nome: "Secondo turno", posti: 10, prenotazioni: [], sospeso: false },
      ]
    },
    'Mercoledì':{
      nome: "Mercoledì",
      turni: [
        { nome: "Primo turno", posti: 20, prenotazioni: [], sospeso: false },
        { nome: "Secondo turno", posti: 20, prenotazioni: [], sospeso: false },
      ]
    },
    'Giovedì':{
      nome: "Giovedì",
      turni: [
        { nome: "Primo turno", posti: 0, prenotazioni: [], sospeso: false },
        { nome: "Secondo turno", posti: 20, prenotazioni: [], sospeso: false },
      ]
    },
    'Sabato':{
      nome: "Sabato",
      turni: [
        { nome: "Primo turno", posti: 20, prenotazioni: [], sospeso: false },
        { nome: "Secondo turno", posti: 20, prenotazioni: [], sospeso: false },
      ]
    }
  };

const adminpassword = "LUCA"; // Define the correct password here

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const correctPassword = "luca"; // Set your desired password

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsLoggedIn(true);
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('Lunedì');
  const [formInput, setFormInput] = useState({turno: "", nome: "" });
  const [weekDates, setWeekDates] = useState({});

  useEffect(() => {
    const getNextDateForDay = (dayName) => {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = new Date();
      const todayIndex = today.getDay();
      const targetIndex = daysOfWeek.indexOf(dayName);
      const diff = (targetIndex - todayIndex + 7) % 7;
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + diff);
      return nextDate.toLocaleDateString("it-IT", { weekday: "short", month: "short", day: "numeric" }).substr(3);
    };
    const dates = {
      Lunedì: getNextDateForDay("Monday"),
      Mercoledì: getNextDateForDay("Wednesday"),
      Giovedì: getNextDateForDay("Thursday"),
      Sabato: getNextDateForDay("Saturday"),
    };

    setWeekDates(dates);
  }, []);

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formInput.nome.trim() === "") return;

    const newBooking = {
      nome: formInput.name,
      turno: formInput.turno
    };

    setData((prevData) => ({
      ...prevData,
      [activeTab]: [...prevData[activeTab], newBooking],
    }));

    setFormInput({ turno: "", nome: "" });
  };

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <form className="login-form" onSubmit={handleLogin}>
          <img src={logo} alt="Logo" className="login-logo" />
          <h2>Login to Acieri Valconca</h2>
          <input
            type="password"
            placeholder="Inserisci Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="primary-button">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="navbar-logo" />
          <div className="logo-text">Acieri Valconca</div>
        </div>
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
        <nav className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
          <a href="/Segnapunti_10_vole.pdf" download>Download File Segnapunti</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Prenota Allenamento</h1>
      </section>

      {/* Tabs Section */}
      <div className="tabs">
        {Object.keys(data).map((day) => (
          <button
            key={day}
            className={`tab-button ${activeTab === day ? "active" : ""}`}
            onClick={() => setActiveTab(day)}
          >
            {day + weekDates[day]}
          </button>
        ))}
      </div>

      {/* Booking Section */}
      <section className="booking-section">
        <h2>Prenotazioni del <strong>{activeTab.toUpperCase()}</strong></h2>
        <table className="booking-table">
          <thead>
            <tr>
              <th>Turno</th>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody>
            {data[activeTab]["turni"][0]["prenotazioni"].map((person) => (
              <tr key={person.turno}>
                <td>{person.turno}</td>
                <td>{person.nome}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data[activeTab].length === 0 && (
          <p className="no-data">Nessuna prenotazione disponibile per {activeTab}.</p>
        )}
      </section>

      {/* Form Section */}
      <section className="form-section">
        <h2>Prenota allenamento per <strong>{activeTab}</strong></h2>
        <form onSubmit={handleFormSubmit} className="booking-form">
          <select
            value={formInput.turno}
            onChange={(e) => setFormInput({ ...formInput, turno: e.target.value })}
          >
            <option value="Primo Turno">Primo Turno</option>
            <option value="Secondo Turno">Secondo Turno</option>
          </select>
          <input
            type="text"
            placeholder="Inserisci il tuo nome"
            value={formInput.nome}
            onChange={(e) => setFormInput({ ...formInput, nome: e.target.value })}
            required
          />
          <button type="submit" className="primary-button">
            Invia
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer>
        <p>Arcieri Apollo Artemide Valconca</p>
      </footer>
    </div>
  );
}

export default App;

//
//const initialData = {
//  Monday: [{ id: 1, name: "Alice Johnson" }, { id: 2, name: "John Smith" }],
//  Wednesday: [{ id: 3, name: "Sophie Turner" }, { id: 4, name: "Michael Brown" }],
//  Thursday: [{ id: 5, name: "Emma Wilson" }, { id: 6, name: "Chris Evans" }],
//  Saturday: [{ id: 7, name: "Robert Downey" }, { id: 8, name: "Natasha Romanoff" }],
//};
//

//

//
//async function fetchGiorniDocument() {
//  // Define a reference to the document
//  const docRef = doc(db, 'giorni', '5h6XEaykZl2USUmmcb6U');
//
//  // Fetch the document
//  try {
//    const docSnap = await getDoc(docRef);
//    if (docSnap.exists()) {
//      console.log("Document data:", docSnap.data());
//      return JSON.parse(docSnap.data().campo).lista; // Document data
//    } else {
//      console.log("No such document!");
//      return null;
//    }
//  } catch (error) {
//    console.error("Error getting document:", error);
//    return null;
//  }
//}
//
//
//
//
////////JSON.parse(docSnap)
//// Function to update the shared state in Firestore
////const updateSharedState = async (newValue) => {
////  try {
////    await setDoc(doc(db, "sharedStateCollection", "sharedStateDocument"), {
////      value: newValue,
////    });
////    console.log("Shared state updated!");
////  } catch (error) {
////    console.error("Error updating shared state: ", error);
////  }
////};

//
//
//
//const CalendarioPrenotazione = () => {
//
//  const [data, setData] = useState(initialData);
//  const [activeTab, setActiveTab] = useState("Monday");
//  const [formInput, setFormInput] = useState({ name: "" });
//
//  const handleFormSubmit = (e) => {
//    e.preventDefault();
//    if (formInput.name.trim() === "") return;
//
//    const newBooking = {
//      id: data[activeTab].length + 1,
//      name: formInput.name,
//    };
//
//    setData((prevData) => ({
//      ...prevData,
//      [activeTab]: [...prevData[activeTab], newBooking],
//    }));
//
//    setFormInput({ name: "" });
//  };
//
//  const [giorni, setGiorni] = useState();
//
//  const [giorniData, setGiorniData] = useState(null);
//
//  useEffect(() => {
//    const fetchData = async () => {
//      const docRef = doc(db, 'giorni', '5h6XEaykZl2USUmmcb6U');
//
//        const docSnap = await getDoc(docRef);
//        if (docSnap.exists()) {
//          setGiorni(JSON.parse(docSnap.data().campo).lista);
//          setGiorniData(JSON.parse(docSnap.data().campo).lista);
//        } else {
//          console.log("No such document!");
//        }
//
//    };
//
//    fetchData();
//  }, []);
//
////  useEffect(() => {
////    // Fetch the document on component mount
////    const fetchData = async () => {
////      const docRef = doc(db, 'giorni', '5h6XEaykZl2USUmmcb6U');
////      const docSnap = await getDoc(docRef);
////      if (docSnap.exists()) {
////        setGiorni(docSnap.data()); // Store document data in state
////        localStorage.setItem("state:lol", docSnap.data());
////      } else {
////        console.log("No such document!");
////      }
////
////    };
////
////    fetchData();
////  }, []);
//
//
//  const [nome, setNome] = useState("");
//  const [giornoSelezionato, setGiornoSelezionato] = useState("");
//  const [turnoSelezionato, setTurnoSelezionato] = useState("");
//
//  const giorniRef = doc(db, 'giorni', '5h6XEaykZl2USUmmcb6U');
//
//  const handlePrenotazione = (event) => {
//    event.preventDefault();
//    if (nome && giornoSelezionato && turnoSelezionato) {
//      const giorno = giorni.find((g) => g.nome === giornoSelezionato);
//      if (giorno) {
//        const turno = giorno.turni.find((t) => t.nome === turnoSelezionato);
//        if (turno) {
//          if (turno.prenotazioni.length < turno.posti && !turno.sospeso) {
//            turno.prenotazioni.push({
//              nome,
//              giorno: giornoSelezionato,
//              turno: turnoSelezionato,
//            });
//            setGiorni([...giorni]);
//            updateGiorniDocument(giorni);
//            setNome("");
//          } else if (turno.sospeso) {
//            alert("Allenamento sospeso!");
//          } else {
//            alert("Posti esauriti!");
//          }
//        }
//      }
//    }
//  };
//
//  const handleCancellazione = (
//    giornoNome: string,
//    turnoNome: string,
//    prenotazioneNome: string,
//    index: number
//  ) => {
//    const isConfirmed = window.confirm(
//      "Sei sicuro di voler CANCELLARE la prenotazione?"
//    );
//    if (isConfirmed) {
//      const giorno = giorni.find((g) => g.nome === giornoNome);
//      if (giorno) {
//        const turno = giorno.turni.find((t) => t.nome === turnoNome);
//        if (turno) {
//          turno.prenotazioni.splice(index, 1);
//          setGiorni([...giorni]);
//        }
//      }
//    }
//  };
//
//  const handleSospensione = (giornoNome: string, turnoNome: string) => {
//    const enteredPassword = window.prompt(
//      "Inserisci la password per sospendere l'allenamento:"
//    );
//
//    if (enteredPassword === password) {
//      const giorno = giorni.find((g) => g.nome === giornoNome);
//      if (giorno) {
//        const turno = giorno.turni.find((t) => t.nome === turnoNome);
//        if (turno) {
//          turno.sospeso = !turno.sospeso;
//          setGiorni([...giorni]);
//        }
//      }
//    } else {
//      alert("Password sbagliata, impossibile procedere");
//    }
//  };
//
//  const handleAggiungiPosti = (giornoNome: string, turnoNome: string) => {
//    const enteredPassword = window.prompt(
//      "Inserisci la password per aggiungere posti:"
//    );
//
//    if (enteredPassword === password) {
//      const giorno = giorni.find((g) => g.nome === giornoNome);
//      if (giorno) {
//        const turno = giorno.turni.find((t) => t.nome === turnoNome);
//        if (turno) {
//          turno.posti++;
//          setGiorni([...giorni]);
//        }
//      }
//    } else {
//      alert("Password sbagliata, impossibile procedere");
//    }
//  };
//
//  const handleDiminuisciPosti = (giornoNome: string, turnoNome: string) => {
//    const enteredPassword = window.prompt(
//      "Inserisci la password per diminuire i posti:"
//    );
//
//    if (enteredPassword === password) {
//      const giorno = giorni.find((g) => g.nome === giornoNome);
//      if (giorno) {
//        const turno = giorno.turni.find((t) => t.nome === turnoNome);
//        if (turno) {
//          if (turno.posti > turno.prenotazioni.length) {
//            turno.posti--;
//            setGiorni([...giorni]);
//          } else {
//            alert("Impossibile diminuire i posti!");
//          }
//        }
//      }
//    } else {
//      alert("Password sbagliata, impossibile procedere");
//    }
//  };
//
//  return (
//    <div className="App">
//      {/* Navbar */}
//      <header className="navbar">
//        <div className="navbar-left">
//
//          <div className="logo">Calendario Prenotazioni</div>
//        </div>
//        <nav>
//          <a href="#">Home</a>
//          <a href="#">Courses</a>
//          <a href="#">Bookings</a>
//          <a href="#">Profile</a>
//        </nav>
//      </header>
//
//      {/* Hero Section */}
//      <section className="hero">
//        <h1>Prenota l allenamento</h1>
//        <button className="primary-button">Get Started</button>
//      </section>
//
//      {/* Form Section */}
//      <section className="form-section">
//        <h2>Book a Session for {activeTab}</h2>
//        <form onSubmit={handleFormSubmit} className="booking-form">
//          <input
//            type="text"
//            placeholder="Enter your name"
//            value={formInput.name}
//            onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
//            required
//          />
//          <button type="submit" className="primary-button">
//            Submit
//          </button>
//        </form>
//      </section>
//
//      {/* Tabs Section */}
//      <div className="tabs">
//        {Object.keys(data).map((day) => (
//          <button
//            key={day}
//            className={`tab-button ${activeTab === day ? "active" : ""}`}
//            onClick={() => setActiveTab(day)}
//          >
//            {day}
//          </button>
//        ))}
//      </div>
//
//      {/* Booking Section */}
//      <section className="booking-section">
//        <h2>{activeTab} Prenotazioni</h2>
//        <table className="booking-table">
//          <thead>
//            <tr>
//              <th>Id</th>
//              <th>Nome</th>
//            </tr>
//          </thead>
//          <tbody>
//            {data[activeTab].map((person) => (
//              <tr key={person.id}>
//                <td>{person.id}</td>
//                <td>{person.name}</td>
//              </tr>
//            ))}
//          </tbody>
//        </table>
//        {data[activeTab].length === 0 && (
//          <p className="no-data">No bookings available for {activeTab}.</p>
//        )}
//      </section>
//
//      {/* Footer */}
//      <footer>
//        <p>© Arcieri Apollo Artemide Valconca. All rights reserved.</p>
//      </footer>
//    </div>
//  );
//};
//
//export default CalendarioPrenotazione;
//
//
//
////import logo from './logo.svg';
////import './App.css';
////
////function App() {
////  return (
////    <div className="App">
////      <header className="App-header">
////        <img src={logo} className="App-logo" alt="logo" />
////        <p>
////          Edit <code>src/App.js</code> and save to reload.
////        </p>
////        <a
////          className="App-link"
////          href="https://reactjs.org"
////          target="_blank"
////          rel="noopener noreferrer"
////        >
////          Learn React
////        </a>
////      </header>
////    </div>
////  );
////}
////
////export default App;
//
////
////
////
////
////<div className="App container mx-auto p-4 bg-orange-100 rounded-2xl shadow-2xl">
////      <h1 className="text-3xl font-bold mb-4 text-black">
////        Calendario Prenotazione
////      </h1>
////      <div className="flex flex-col md:flex-row justify-center mb-4">
////        <select
////          className="block w-full md:w-1/3 p-2 mb-4 md:mb-0 bg-white rounded"
////          value={giornoSelezionato}
////          onChange={(e) => setGiornoSelezionato(e.target.value)}
////        >
////          <option value="">Seleziona giorno</option>
////          {Array.isArray(giorni) && giorni.map((giorno) => (
////            <option key={giorno.nome} value={giorno.nome}>
////              {giorno.nome}
////            </option>
////          ))}
////        </select>
////        <select
////          className="block w-full md:w-1/3 p-2 mb-4 md:mb-0 bg-white rounded"
////          value={turnoSelezionato}
////          onChange={(e) => setTurnoSelezionato(e.target.value)}
////        >
////          <option value="">Seleziona turno</option>
////          {Array.isArray(giorni) && giorni
////            .find((g) => g.nome === giornoSelezionato)
////            ?.turni.map((turno) => (
////              <option key={turno.nome} value={turno.nome}>
////                {turno.nome}
////              </option>
////            ))}
////        </select>
////        <input
////          className="block w-full md:w-1/3 p-2 mb-4 md:mb-0 bg-white rounded"
////          type="text"
////          value={nome}
////          onChange={(e) => setNome(e.target.value)}
////          placeholder="Inserisci nome"
////        />
////        <button
////          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
////          onClick={handlePrenotazione}
////        >
////          Prenota
////        </button>
////      </div>
////      <div className="flex flex-col">
////        {Array.isArray(giorni) && giorni.map((giorno) => (
////          <div key={giorno.nome} className="mb-4 bg-white rounded p-4">
////            <h2 className="text-2xl font-bold">{giorno.nome}</h2>
////            {Array.isArray(giorni) && giorno.turni.map((turno) => (
////              <div key={turno.nome} className="mb-4">
////                <h3 className="text-xl font-bold">{turno.nome}</h3>
////                {turno.sospeso ? (
////                  <p className="text-lg text-red-500">Allenamento sospeso</p>
////                ) : (
////                  <p className="text-lg">
////                    Posti liberi: {turno.posti - turno.prenotazioni.length}
////                  </p>
////                )}
////                <button
////                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
////                  onClick={() => handleSospensione(giorno.nome, turno.nome)}
////                >
////                  {turno.sospeso ? "Riprendi" : "Sospendi"}
////                </button>
////                <button
////                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
////                  onClick={() => handleAggiungiPosti(giorno.nome, turno.nome)}
////                >
////                  <Plus className="w-4 h-4" />
////                </button>
////                <button
////                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
////                  onClick={() => handleDiminuisciPosti(giorno.nome, turno.nome)}
////                >
////                  <Minus className="w-4 h-4" />
////                </button>
////                <ul>
////                  {Array.isArray(giorni) && turno.prenotazioni.map((prenotazione, index) => (
////                    <li key={index} className="flex justify-between">
////                      <span>{prenotazione.nome}</span>
////                      <button
////                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
////                        onClick={() =>
////                          handleCancellazione(
////                            giorno.nome,
////                            turno.nome,
////                            prenotazione.nome,
////                            index
////                          )
////                        }
////                      >
////                        <X className="w-4 h-4" />
////                      </button>
////                    </li>
////                  ))}
////                </ul>
////              </div>
////            ))}
////          </div>
////        ))}
////      </div>
////    </div>
