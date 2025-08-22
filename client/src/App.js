import { useState, useEffect } from "react";
import axios from "axios";
import { getUserLocation, getCityFromCoords } from "./getUserLocation";

function App() {
  const [cities, setCities] = useState([]); // ✅ Store all cities from DB
  const [currentCity, setCurrentCity] = useState(""); // ✅ For UI
  const [loading, setLoading] = useState(false);

  const API = process.env.REACT_APP_BACKEND_URL;

  // ✅ Fetch all stored cities on load
  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${API}/api/cities`);
      setCities(res.data);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  // ✅ Handle city fetch & save
  const handleGetCity = async () => {
  setLoading(true);
  try {
    const coords = await getUserLocation();
    const { fullAddress, city } = await getCityFromCoords(coords);

    console.log("📍 Full Address:", fullAddress); // show in UI/log
    console.log("🏙️ City:", city); // clean city name

    if (city && city !== "Unknown") {
      setCurrentCity(city);

      // ✅ Save only city to DB
      await axios.post(`${API}/api/cities`, { city });

      // ✅ Refresh list
      fetchCities();
    } else {
      setCurrentCity(null);
    }
  } catch (err) {
    console.error("Failed to get city:", err);
    setCurrentCity(null);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>📍 City Tracker</h1>

      {/* Button to fetch city */}
      <button onClick={handleGetCity}>
        {loading ? "Fetching..." : "Get My City"}
      </button>

      {currentCity && (
        <p>
          ✅ Your city: <strong>{currentCity}</strong>
        </p>
      )}

      <hr />

      <h3>🌍 Cities Stored in Database:</h3>
      <ul>
        {cities.length === 0 ? (
          <li>No cities saved yet</li>
        ) : (
          cities.map((c, index) => (
            <li key={c._id || index}>{c.city}</li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
