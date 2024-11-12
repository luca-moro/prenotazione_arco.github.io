import { useMemo, useState, useEffect } from "react";
import { Calendar, X, Pause, Plus, Minus } from "lucide-react";
import { initializeApp } from 'firebase/app';
import { getFirestore, updateDoc } from 'firebase/firestore';
import { collection, doc, getDocs, setDoc, addDoc, getDoc } from "firebase/firestore";
import { getDatabase, ref, onValue, set, push } from 'firebase/database';


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
    campo: JSON.stringify(newData)
  }

  try {
    // Update the document with the new data
    await updateDoc(docRef, updateData);
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}

async function fetchGiorniDocument() {
  // Define a reference to the document
  const docRef = doc(db, 'giorni', '5h6XEaykZl2USUmmcb6U');

  // Fetch the document
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return JSON.parse(docSnap.data()); // Document data
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}




//////JSON.parse(docSnap)
// Function to update the shared state in Firestore
//const updateSharedState = async (newValue) => {
//  try {
//    await setDoc(doc(db, "sharedStateCollection", "sharedStateDocument"), {
//      value: newValue,
//    });
//    console.log("Shared state updated!");
//  } catch (error) {
//    console.error("Error updating shared state: ", error);
//  }
//};

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

const password = "LUCA"; // Define the correct password here

const CalendarioPrenotazione = () => {
//  fetchGiorniDocument()

  const [giorni, setGiorni] = useState([
    {
      nome: "Lunedì",
      turni: [
        { nome: "Primo turno", posti: 10, prenotazioni: [], sospeso: false },
        { nome: "Secondo turno", posti: 10, prenotazioni: [], sospeso: false },
      ],
    },
    {
      nome: "Mercoledì",
      turni: [
        { nome: "Primo turno", posti: 20, prenotazioni: [], sospeso: false },
        { nome: "Secondo turno", posti: 20, prenotazioni: [], sospeso: false },
      ],
    },
    {
      nome: "Giovedì",
      turni: [
        { nome: "Turno unico", posti: 20, prenotazioni: [], sospeso: false },
      ],
    },
    {
      nome: "Sabato",
      turni: [
        { nome: "Primo turno", posti: 20, prenotazioni: [], sospeso: false },
        { nome: "Secondo turno", posti: 20, prenotazioni: [], sospeso: false },
      ],
    },
  ]);

  const [giorniData, setGiorniData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'giorni', '5h6XEaykZl2USUmmcb6U');

        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGiorniData(docSnap.data().campo);
        } else {
          console.log("No such document!");
        }

    };

    fetchData();
  }, []);

//  useEffect(() => {
//    // Fetch the document on component mount
//    const fetchData = async () => {
//      const docRef = doc(db, 'giorni', '5h6XEaykZl2USUmmcb6U');
//      const docSnap = await getDoc(docRef);
//      if (docSnap.exists()) {
//        setGiorni(docSnap.data()); // Store document data in state
//        localStorage.setItem("state:lol", docSnap.data());
//      } else {
//        console.log("No such document!");
//      }
//
//    };
//
//    fetchData();
//  }, []);


  const [nome, setNome] = useState("");
  const [giornoSelezionato, setGiornoSelezionato] = useState("");
  const [turnoSelezionato, setTurnoSelezionato] = useState("");

  const giorniRef = doc(db, 'giorni', '5h6XEaykZl2USUmmcb6U');

  const handlePrenotazione = (event) => {
    event.preventDefault();
    if (nome && giornoSelezionato && turnoSelezionato) {
      const giorno = giorni.find((g) => g.nome === giornoSelezionato);
      if (giorno) {
        const turno = giorno.turni.find((t) => t.nome === turnoSelezionato);
        if (turno) {
          if (turno.prenotazioni.length < turno.posti && !turno.sospeso) {
            turno.prenotazioni.push({
              nome,
              giorno: giornoSelezionato,
              turno: turnoSelezionato,
            });
            setGiorni([...giorni]);
            updateGiorniDocument(giorni);
            setNome("");
          } else if (turno.sospeso) {
            alert("Allenamento sospeso!");
          } else {
            alert("Posti esauriti!");
          }
        }
      }
    }
  };

  const handleCancellazione = (
    giornoNome: string,
    turnoNome: string,
    prenotazioneNome: string,
    index: number
  ) => {
    const isConfirmed = window.confirm(
      "Sei sicuro di voler CANCELLARE la prenotazione?"
    );
    if (isConfirmed) {
      const giorno = giorni.find((g) => g.nome === giornoNome);
      if (giorno) {
        const turno = giorno.turni.find((t) => t.nome === turnoNome);
        if (turno) {
          turno.prenotazioni.splice(index, 1);
          setGiorni([...giorni]);
        }
      }
    }
  };

  const handleSospensione = (giornoNome: string, turnoNome: string) => {
    const enteredPassword = window.prompt(
      "Inserisci la password per sospendere l'allenamento:"
    );

    if (enteredPassword === password) {
      const giorno = giorni.find((g) => g.nome === giornoNome);
      if (giorno) {
        const turno = giorno.turni.find((t) => t.nome === turnoNome);
        if (turno) {
          turno.sospeso = !turno.sospeso;
          setGiorni([...giorni]);
        }
      }
    } else {
      alert("Password sbagliata, impossibile procedere");
    }
  };

  const handleAggiungiPosti = (giornoNome: string, turnoNome: string) => {
    const enteredPassword = window.prompt(
      "Inserisci la password per aggiungere posti:"
    );

    if (enteredPassword === password) {
      const giorno = giorni.find((g) => g.nome === giornoNome);
      if (giorno) {
        const turno = giorno.turni.find((t) => t.nome === turnoNome);
        if (turno) {
          turno.posti++;
          setGiorni([...giorni]);
        }
      }
    } else {
      alert("Password sbagliata, impossibile procedere");
    }
  };

  const handleDiminuisciPosti = (giornoNome: string, turnoNome: string) => {
    const enteredPassword = window.prompt(
      "Inserisci la password per diminuire i posti:"
    );

    if (enteredPassword === password) {
      const giorno = giorni.find((g) => g.nome === giornoNome);
      if (giorno) {
        const turno = giorno.turni.find((t) => t.nome === turnoNome);
        if (turno) {
          if (turno.posti > turno.prenotazioni.length) {
            turno.posti--;
            setGiorni([...giorni]);
          } else {
            alert("Impossibile diminuire i posti!");
          }
        }
      }
    } else {
      alert("Password sbagliata, impossibile procedere");
    }
  };

  return (
    <div className="container mx-auto p-4 bg-orange-100 rounded-2xl shadow-2xl">
      <h1>Giorni Document Data</h1>
      {giorniData ? (
        <pre>{JSON.stringify(giorniData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
      <h1 className="text-3xl font-bold mb-4 text-black">
        Calendario Prenotazione
      </h1>
      <div className="flex flex-col md:flex-row justify-center mb-4">
        <select
          className="block w-full md:w-1/3 p-2 mb-4 md:mb-0 bg-white rounded"
          value={giornoSelezionato}
          onChange={(e) => setGiornoSelezionato(e.target.value)}
        >
          <option value="">Seleziona giorno</option>
          {giorni.map((giorno) => (
            <option key={giorno.nome} value={giorno.nome}>
              {giorno.nome}
            </option>
          ))}
        </select>
        <select
          className="block w-full md:w-1/3 p-2 mb-4 md:mb-0 bg-white rounded"
          value={turnoSelezionato}
          onChange={(e) => setTurnoSelezionato(e.target.value)}
        >
          <option value="">Seleziona turno</option>
          {giorni
            .find((g) => g.nome === giornoSelezionato)
            ?.turni.map((turno) => (
              <option key={turno.nome} value={turno.nome}>
                {turno.nome}
              </option>
            ))}
        </select>
        <input
          className="block w-full md:w-1/3 p-2 mb-4 md:mb-0 bg-white rounded"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Inserisci nome"
        />
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          onClick={handlePrenotazione}
        >
          Prenota
        </button>
      </div>
      <div className="flex flex-col">
        {giorni.map((giorno) => (
          <div key={giorno.nome} className="mb-4 bg-white rounded p-4">
            <h2 className="text-2xl font-bold">{giorno.nome}</h2>
            {giorno.turni.map((turno) => (
              <div key={turno.nome} className="mb-4">
                <h3 className="text-xl font-bold">{turno.nome}</h3>
                {turno.sospeso ? (
                  <p className="text-lg text-red-500">Allenamento sospeso</p>
                ) : (
                  <p className="text-lg">
                    Posti liberi: {turno.posti - turno.prenotazioni.length}
                  </p>
                )}
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleSospensione(giorno.nome, turno.nome)}
                >
                  {turno.sospeso ? "Riprendi" : "Sospendi"}
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleAggiungiPosti(giorno.nome, turno.nome)}
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleDiminuisciPosti(giorno.nome, turno.nome)}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <ul>
                  {turno.prenotazioni.map((prenotazione, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{prenotazione.nome}</span>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() =>
                          handleCancellazione(
                            giorno.nome,
                            turno.nome,
                            prenotazione.nome,
                            index
                          )
                        }
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarioPrenotazione;



//import logo from './logo.svg';
//import './App.css';
//
//function App() {
//  return (
//    <div className="App">
//      <header className="App-header">
//        <img src={logo} className="App-logo" alt="logo" />
//        <p>
//          Edit <code>src/App.js</code> and save to reload.
//        </p>
//        <a
//          className="App-link"
//          href="https://reactjs.org"
//          target="_blank"
//          rel="noopener noreferrer"
//        >
//          Learn React
//        </a>
//      </header>
//    </div>
//  );
//}
//
//export default App;
