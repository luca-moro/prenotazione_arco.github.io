import { useMemo, useState, useEffect } from "react";
import { Calendar, X, Pause, Plus, Minus } from "lucide-react";

function usePersistState<T>(
  initial_value: T,
  id: string
): [T, (new_state: T) => void] {
  // Set initial value
  const _initial_value = useMemo(() => {
    const local_storage_value_str = localStorage.getItem("state:" + id);
    // If there is a value stored in localStorage, use that
    if (local_storage_value_str) {
      return JSON.parse(local_storage_value_str);
    }
    // Otherwise use initial_value that was passed to the function
    return initial_value;
  }, []);

  const [state, setState] = useState(_initial_value);

  useEffect(() => {
    const state_str = JSON.stringify(state); // Stringified state
    localStorage.setItem("state:" + id, state_str); // Set stringified state as item in localStorage
  }, [state]);

  return [state, setState];
}

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
  const [giorni, setGiorni] = usePersistState<Giorno[]>(
    [
      {
        nome: "Lunedì",
        turni: [
          { nome: "Primo turno", posti: 10, prenotazioni: [], sospeso: false },
          {
            nome: "Secondo turno",
            posti: 10,
            prenotazioni: [],
            sospeso: false,
          },
        ],
      },
      {
        nome: "Mercoledì",
        turni: [
          { nome: "Primo turno", posti: 20, prenotazioni: [], sospeso: false },
          {
            nome: "Secondo turno",
            posti: 20,
            prenotazioni: [],
            sospeso: false,
          },
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
          {
            nome: "Secondo turno",
            posti: 20,
            prenotazioni: [],
            sospeso: false,
          },
        ],
      },
    ],
    "giorni"
  );

  const [nome, setNome] = useState("");
  const [giornoSelezionato, setGiornoSelezionato] = useState("");
  const [turnoSelezionato, setTurnoSelezionato] = useState("");

  const handlePrenotazione = () => {
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
