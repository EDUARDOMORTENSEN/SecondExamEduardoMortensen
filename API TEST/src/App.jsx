import React, { useState, useEffect } from "react";

const App = () => {
  const [country, setCountry] = useState("Peru");
  const [universities, setUniversities] = useState([]);
  const [error, setError] = useState("");

  const fetchUniversities = async (countryName) => {
    try {
      const response = await fetch(`http://universities.hipolabs.com/search?country=${countryName}`);
      if (!response.ok) throw new Error("Failed to fetch universities.");
      const data = await response.json();
      setUniversities(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setUniversities([]);
    }
  };

  useEffect(() => {
    fetchUniversities(country);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUniversities(country);
  };

  // Extract all unique keys for dynamic table headers
  const allKeys = Array.from(
    new Set(universities.flatMap((uni) => Object.keys(uni)))
  );

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>University Search by Country</h2>
      <form onSubmit={handleSearch}>
        <label>
          Country:
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
        <button type="submit" style={{ marginLeft: "1rem" }}>
          Search
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3 style={{ marginTop: "2rem" }}>
        Results ({universities.length} universities)
      </h3>
      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              {allKeys.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {universities.map((uni, index) => (
              <tr key={index}>
                {allKeys.map((key) => (
                  <td key={key}>
                    {Array.isArray(uni[key])
                      ? uni[key].join(", ")
                      : uni[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
