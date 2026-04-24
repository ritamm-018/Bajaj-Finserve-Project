import { useState } from 'react';
import './App.css';
import HierarchyVisualizer from './components/HierarchyVisualizer';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Default API URL - update this after deployment
  const [apiUrl, setApiUrl] = useState('http://localhost:3001/bfhl');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Parse input - support comma-separated or newline-separated
      const rawInput = input.trim();
      let dataArray;

      if (rawInput.includes(',')) {
        dataArray = rawInput.split(',').map(s => s.trim()).filter(Boolean);
      } else {
        dataArray = rawInput.split('\n').map(s => s.trim()).filter(Boolean);
      }

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: dataArray }),
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to API');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    const example = `A->B
A->C
B->D
C->E
E->F
X->Y
Y->Z
Z->X
P->Q
Q->R
G->H
G->H
G->I
hello
1->2
A->`;
    setInput(example);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🌳 Hierarchy Analyzer</h1>
        <p>Analyze node relationships, detect cycles, and visualize tree structures</p>
      </header>

      <div className="container">
        <div className="input-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="api-url">API Endpoint</label>
              <input
                id="api-url"
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://your-api.com/bfhl"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="data-input">
                Node Data
                <span className="label-hint">
                  (Enter edges like "A-&gt;B", one per line or comma-separated)
                </span>
              </label>
              <textarea
                id="data-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="A->B&#10;A->C&#10;B->D"
                rows={12}
                className="textarea-field"
                required
              />
            </div>

            <div className="button-group">
              <button type="button" onClick={loadExample} className="btn btn-secondary">
                Load Example
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Processing...' : 'Analyze'}
              </button>
            </div>
          </form>

          {error && (
            <div className="alert alert-error">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {response && (
          <div className="results-section">
            <HierarchyVisualizer data={response} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
