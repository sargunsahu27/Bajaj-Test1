import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const data = input
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      const response = await axios.post(
        "http://localhost:3000/bfhl",
        { data }
      );

      setResult(response.data);
    } catch (err) {
      setError("Failed to fetch response from API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Hierarchy Processor</h1>

      <textarea
        rows="8"
        placeholder="Example: A->B, A->C, B->D"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Submit
      </button>

      {loading && <p>Processing...</p>}

      {error && <p className="error">{error}</p>}

      {result && (
        <>
          <div className="card">
            <h2>User Details</h2>
            <p><strong>User ID:</strong> {result.user_id}</p>
            <p><strong>Email:</strong> {result.email_id}</p>
            <p><strong>Roll Number:</strong> {result.college_roll_number}</p>
          </div>

          <div className="card">
            <h2>Summary</h2>
            <p>Total Trees: {result.summary.total_trees}</p>
            <p>Total Cycles: {result.summary.total_cycles}</p>
            <p>Largest Tree Root: {result.summary.largest_tree_root}</p>
          </div>

          <div className="card">
            <h2>Hierarchies</h2>

            {result.hierarchies.map((item, index) => (
              <div key={index} className="hierarchy">
                <h3>Root: {item.root}</h3>

                {item.has_cycle ? (
                  <p className="cycle">Cycle Detected</p>
                ) : (
                  <>
                    <p>Depth: {item.depth}</p>

                    <pre>
                      {JSON.stringify(
                        item.tree,
                        null,
                        2
                      )}
                    </pre>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="card">
            <h2>Invalid Entries</h2>

            {result.invalid_entries.length === 0 ? (
              <p>None</p>
            ) : (
              <ul>
                {result.invalid_entries.map(
                  (entry, index) => (
                    <li key={index}>{entry}</li>
                  )
                )}
              </ul>
            )}
          </div>

          <div className="card">
            <h2>Duplicate Edges</h2>

            {result.duplicate_edges.length === 0 ? (
              <p>None</p>
            ) : (
              <ul>
                {result.duplicate_edges.map(
                  (entry, index) => (
                    <li key={index}>{entry}</li>
                  )
                )}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;