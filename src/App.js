import React, { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");
  const [selection, setSelection] = useState([]);

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(input);

      // Ensure that the parsed JSON has a 'data' field
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        setError("Invalid input. Ensure 'data' field is an array.");
        return;
      }

      const response = await fetch(
        "https://project-root-aq3edsiqm-scruxas-projects.vercel.app/api/api",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: parsedData.data }),
        }
      );

      if (!response.ok) {
        // If the status is not OK, show an error
        setError(`Error: ${response.status} ${response.statusText}`);
        setResponseData(null);
        return;
      }

      const result = await response.json();
      setResponseData(result);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Invalid JSON input. Make sure to provide valid JSON.");
    }
  };

  const handleSelectionChange = (e) => {
    const options = [...e.target.options]
      .filter((option) => option.selected)
      .map((option) => option.value);
    setSelection(options);
  };

  return (
    <div className="App">
      <h1>Bajaj Finserv Health Challenge</h1>
      <textarea
        placeholder="Enter JSON here"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleSubmit}>Submit</button>

      {responseData && (
        <>
          <h2>Select Data to Display</h2>
          <select multiple={true} onChange={handleSelectionChange}>
            <option value="numbers">Numbers</option>
            <option value="alphabets">Alphabets</option>
            <option value="highest_lowercase_alphabet">
              Highest Lowercase Alphabet
            </option>
          </select>

          <h3>Response Data:</h3>
          {selection.includes("numbers") && (
            <p>Numbers: {JSON.stringify(responseData.numbers)}</p>
          )}
          {selection.includes("alphabets") && (
            <p>Alphabets: {JSON.stringify(responseData.alphabets)}</p>
          )}
          {selection.includes("highest_lowercase_alphabet") && (
            <p>
              Highest Lowercase Alphabet:{" "}
              {JSON.stringify(responseData.highest_lowercase_alphabet)}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
