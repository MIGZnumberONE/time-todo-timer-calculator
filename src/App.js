import React, { useState } from 'react'; // Importiert React und den useState-Hook
import './App.css'; // Importiert die CSS-Datei für das Styling

// Funktionale Komponente `App`
function App() {
  // Zustände für die To-Do App
  const [todos, setTodos] = useState([
    { id: 1, text: "Kaffee kaufen", completed: false }, // Beispiel-To-Do
  ]);
  const [text, setText] = useState(''); // Zustand für das Texteingabefeld der To-Do App

  // Zustände für den Feierabend-Rechner
  const [startTime, setStartTime] = useState(''); // Zustand für die Startzeit (HH:MM)
  const [endTime, setEndTime] = useState(''); // Zustand für die berechnete Feierabendzeit
  const [error, setError] = useState(''); // Zustand für Fehlermeldungen
  const [timer, setTimer] = useState(15); // Zustand für den Timer (Standard: 15 Minuten)
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Zustand, ob der Timer läuft
  const [timeRemaining, setTimeRemaining] = useState(timer * 60); // Zustand für verbleibende Zeit in Sekunden
  const [intervalId, setIntervalId] = useState(null); // Zustand für die Interval-ID (zum Stoppen des Timers)
  const [customTime, setCustomTime] = useState(''); // Zustand für benutzerdefinierte Timerzeit

  // Funktion, um den "erledigt"-Status einer To-Do zu toggeln
  const toggleCompleted = (todo) => {
    const updatedTodos = todos.map((current) => {
      // Überprüfen, ob das aktuelle To-Do dem geklickten entspricht
      if (current === todo) {
        return { ...current, completed: !current.completed }; // Status umschalten
      }
      return current; // Unverändertes To-Do zurückgeben
    });
    setTodos(updatedTodos); // Aktualisierte Liste setzen
  };

  // Funktion, um ein neues To-Do zu erstellen
  const createTodo = () => {
    if (!text.trim()) return; // Abbrechen, wenn der Text leer ist
    const id = Math.random(); // Generiert eine zufällige ID
    setTodos([...todos, { id, text, completed: false }]); // Neues To-Do zur Liste hinzufügen
    setText(''); // Texteingabefeld zurücksetzen
  };

  // Funktion zur Berechnung der Feierabendzeit
  const calculateEndTime = () => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/; // Regex zur Überprüfung der Startzeit
    if (!timeRegex.test(startTime)) {
      setError('Bitte gib eine gültige Startzeit im Format HH:MM ein.'); // Fehler setzen
      setEndTime(''); // Endzeit zurücksetzen
      return; // Funktion beenden
    }

    const [hours, minutes] = startTime.split(':').map(Number); // Startzeit in Stunden und Minuten aufteilen
    const addedHours = 8; // Arbeitszeit in Stunden
    const addedMinutes = 42; // Arbeitszeit in Minuten

    let totalHours = hours + addedHours; // Stunden addieren
    let totalMinutes = minutes + addedMinutes; // Minuten addieren

    if (totalMinutes >= 60) {
      totalHours += Math.floor(totalMinutes / 60); // Zusätzliche Stunden aus Minuten berechnen
      totalMinutes = totalMinutes % 60; // Minuten normalisieren
    }

    const formattedTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}`; // Zeit formatieren
    setEndTime(formattedTime); // Berechnete Feierabendzeit setzen
    setError(''); // Fehler zurücksetzen
  };

  // Funktion, um den Timer zu starten
  const startTimer = () => {
    if (intervalId) return; // Verhindert mehrfaches Starten

    const id = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(id); // Timer stoppen, wenn Zeit abgelaufen ist
          setIntervalId(null); // Interval-ID zurücksetzen
          return 0; // Zeit auf 0 setzen
        }
        return prevTime - 1; // Zeit um eine Sekunde reduzieren
      });
    }, 1000); // Jede Sekunde ausführen

    setIntervalId(id); // Interval-ID speichern
    setIsTimerRunning(true); // Timer-Status setzen
  };

  // Funktion, um den Timer zu pausieren
  const pauseTimer = () => {
    if (intervalId) {
      clearInterval(intervalId); // Timer stoppen
      setIntervalId(null); // Interval-ID zurücksetzen
      setIsTimerRunning(false); // Timer-Status setzen
    }
  };

  // Funktion, um den Timer zurückzusetzen
  const resetTimer = () => {
    if (intervalId) {
      clearInterval(intervalId); // Timer stoppen
      setIntervalId(null); // Interval-ID zurücksetzen
    }
    setTimeRemaining(timer * 60); // Verbleibende Zeit auf ursprüngliche Dauer zurücksetzen
    setIsTimerRunning(false); // Timer-Status setzen
  };

  // Funktion, um die benutzerdefinierte Timerzeit zu ändern
  const handleCustomTimeChange = (e) => {
    const minutes = parseInt(e.target.value); // Eingabe in eine Zahl umwandeln
    if (!isNaN(minutes) && minutes > 0) {
      setCustomTime(e.target.value); // Eingabe speichern
      setTimer(minutes); // Timer aktualisieren
      setTimeRemaining(minutes * 60); // Verbleibende Zeit setzen
    }
  };

  // JSX-Teil der App
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Feierabend Rechner & To-Do App</h1> {/* Überschrift der App */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}> {/* Layout für zwei Bereiche */}
        
        {/* To-Do App Bereich */}
        <div style={{ flex: 1, marginRight: '20px' }}>
          <h2>To-Do App</h2> {/* Titel der To-Do App */}
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                <label
                  htmlFor={`todo-${todo.id}`} // Das Label ist mit der Checkbox verknüpft
                  style={{
                    textDecoration: todo.completed ? "line-through" : "",
                  }}
                >
                  <input
                    id={`todo-${todo.id}`} // Eindeutige ID für jede Checkbox
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleCompleted(todo)} // Umschalten des Status
                  />
                  {todo.text}
                </label>
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Neues Todo" // Platzhaltertext
            value={text} // Wert des Eingabefelds
            onChange={(e) => setText(e.target.value)} // Eingabewert speichern
          />
          <button onClick={createTodo}>ToDo Hinzufügen</button> {/* Button zum Hinzufügen */}
        </div>

        {/* Feierabend Rechner Bereich */}
        <div style={{ flex: 1 }}>
          <h2>Feierabend Rechner</h2> {/* Titel des Feierabend Rechners */}
          <input
            type="text"
            placeholder="Startzeit (HH:MM)" // Platzhaltertext
            value={startTime} // Wert des Eingabefelds
            onChange={(e) => setStartTime(e.target.value)} // Eingabewert speichern
            maxLength="5" // Maximale Länge (HH:MM)
          />
          <button onClick={calculateEndTime}>Berechne Feierabend</button> {/* Button zur Berechnung */}
          {error && <p className="error">{error}</p>} {/* Fehleranzeige */}
          {endTime && (
            <div><h2>Feierabend um: {endTime}</h2></div>
            )}
          {/* Klassische Zeilenumbrüche */}
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <input
            type="number"
            placeholder="Timer Zeit (Minuten)" // Platzhaltertext
            value={customTime} // Wert des Eingabefelds
            onChange={handleCustomTimeChange} // Eingabewert speichern
          />
          <div>
            <h3>
              Timer: {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
            </h3>
            <button onClick={startTimer} disabled={isTimerRunning}>Starten</button>
            <button onClick={pauseTimer} disabled={!isTimerRunning}>Pausieren</button>
            <button onClick={resetTimer} disabled={!isTimerRunning && timeRemaining === timer * 60}>Zurücksetzen</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; // Export der Komponente