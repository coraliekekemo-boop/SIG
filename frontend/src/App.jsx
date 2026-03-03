import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import LoginForm from "./components/LoginForm";
import VehicleForm from "./components/VehicleForm";
import VehicleList from "./components/VehicleList";
import MapView from "./components/MapView";

const tokenStorageKey = "sig_token";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(tokenStorageKey));
  const [vehicles, setVehicles] = useState([]);
  const [latestPositions, setLatestPositions] = useState([]);
  const [historyPoints, setHistoryPoints] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [historyVehicleId, setHistoryVehicleId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [newPosition, setNewPosition] = useState({
    vehicle_id: "",
    latitude: "",
    longitude: "",
  });

  const [searchForm, setSearchForm] = useState({
    lat: "5.348",
    lng: "-4.007",
    radius: "3000",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [nearestResult, setNearestResult] = useState(null);

  const focusPoint = useMemo(() => {
    if (nearestResult) {
      return [Number(nearestResult.latitude), Number(nearestResult.longitude)];
    }
    return null;
  }, [nearestResult]);

  const clearNotice = () => {
    setMessage("");
    setError("");
  };

  const loadBaseData = async (authToken) => {
    const [vehiclesData, latestData] = await Promise.all([
      api.listVehicles(authToken),
      api.latestPositions(authToken),
    ]);
    setVehicles(vehiclesData);
    setLatestPositions(latestData);
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    loadBaseData(token).catch((err) => setError(err.message));
  }, [token]);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    localStorage.setItem(tokenStorageKey, data.token);
    setToken(data.token);
    clearNotice();
  };

  const register = async (username, password) => {
    const data = await api.register(username, password);
    localStorage.setItem(tokenStorageKey, data.token);
    setToken(data.token);
    clearNotice();
  };

  const logout = () => {
    localStorage.removeItem(tokenStorageKey);
    setToken(null);
    setVehicles([]);
    setLatestPositions([]);
    setHistoryPoints([]);
    setSearchResults([]);
    setNearestResult(null);
  };

  const saveVehicle = async (payload) => {
    clearNotice();
    try {
      if (selectedVehicle) {
        await api.updateVehicle(selectedVehicle.id, payload, token);
        setMessage("Vehicule mis a jour");
      } else {
        await api.createVehicle(payload, token);
        setMessage("Vehicule ajoute");
      }
      setSelectedVehicle(null);
      await loadBaseData(token);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteVehicle = async (id) => {
    clearNotice();
    try {
      await api.deleteVehicle(id, token);
      setMessage("Vehicule supprime");
      if (selectedVehicle?.id === id) {
        setSelectedVehicle(null);
      }
      if (historyVehicleId === id) {
        setHistoryVehicleId(null);
        setHistoryPoints([]);
      }
      await loadBaseData(token);
    } catch (err) {
      setError(err.message);
    }
  };

  const showHistory = async (vehicleId) => {
    clearNotice();
    try {
      const points = await api.history(vehicleId, token);
      setHistoryVehicleId(vehicleId);
      setHistoryPoints(points);
      setMessage(`Historique charge (${points.length} points)`);
    } catch (err) {
      setError(err.message);
    }
  };

  const addPosition = async (event) => {
    event.preventDefault();
    clearNotice();
    try {
      await api.addPosition(
        {
          vehicle_id: Number(newPosition.vehicle_id),
          latitude: Number(newPosition.latitude),
          longitude: Number(newPosition.longitude),
        },
        token
      );
      setNewPosition({ vehicle_id: "", latitude: "", longitude: "" });
      setMessage("Position enregistree");
      await loadBaseData(token);
      if (historyVehicleId) {
        const points = await api.history(historyVehicleId, token);
        setHistoryPoints(points);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const doRadiusSearch = async (event) => {
    event.preventDefault();
    clearNotice();
    try {
      const rows = await api.radiusSearch(searchForm.lat, searchForm.lng, searchForm.radius, token);
      setSearchResults(rows);
      setMessage(`${rows.length} vehicule(s) dans le rayon`);
    } catch (err) {
      setError(err.message);
    }
  };

  const doNearestSearch = async () => {
    clearNotice();
    try {
      const row = await api.nearest(searchForm.lat, searchForm.lng, token);
      setNearestResult(row);
      setMessage(`Vehicule le plus proche: ${row.code}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!token) {
    return (
      <main className="centered">
        <LoginForm onLogin={login} onRegister={register} />
      </main>
    );
  }

  return (
    <main className="layout">
      <aside className="sidebar">
        <div className="card">
          <h2>SIG Vehicules</h2>
          <button onClick={logout} className="ghost">
            Deconnexion
          </button>
        </div>

        <VehicleForm
          selectedVehicle={selectedVehicle}
          onSubmit={saveVehicle}
          onCancel={() => setSelectedVehicle(null)}
        />

        <VehicleList
          vehicles={vehicles}
          onEdit={setSelectedVehicle}
          onDelete={deleteVehicle}
          onShowHistory={showHistory}
          selectedId={historyVehicleId}
        />

        <div className="card">
          <h3>Nouvelle position GPS</h3>
          <form onSubmit={addPosition}>
            <label>
              Vehicule
              <select
                value={newPosition.vehicle_id}
                onChange={(e) => setNewPosition((p) => ({ ...p, vehicle_id: e.target.value }))}
                required
              >
                <option value="">Selectionner...</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.code} - {v.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Latitude
              <input
                type="number"
                step="any"
                value={newPosition.latitude}
                onChange={(e) => setNewPosition((p) => ({ ...p, latitude: e.target.value }))}
                required
              />
            </label>
            <label>
              Longitude
              <input
                type="number"
                step="any"
                value={newPosition.longitude}
                onChange={(e) => setNewPosition((p) => ({ ...p, longitude: e.target.value }))}
                required
              />
            </label>
            <button type="submit">Enregistrer point</button>
          </form>
        </div>

        <div className="card">
          <h3>Recherche geographique</h3>
          <form onSubmit={doRadiusSearch}>
            <label>
              Latitude
              <input
                type="number"
                step="any"
                value={searchForm.lat}
                onChange={(e) => setSearchForm((p) => ({ ...p, lat: e.target.value }))}
              />
            </label>
            <label>
              Longitude
              <input
                type="number"
                step="any"
                value={searchForm.lng}
                onChange={(e) => setSearchForm((p) => ({ ...p, lng: e.target.value }))}
              />
            </label>
            <label>
              Rayon (m)
              <input
                type="number"
                value={searchForm.radius}
                onChange={(e) => setSearchForm((p) => ({ ...p, radius: e.target.value }))}
              />
            </label>
            <div className="row">
              <button type="submit">Recherche rayon</button>
              <button type="button" onClick={doNearestSearch} className="ghost">
                Plus proche
              </button>
            </div>
          </form>

          {nearestResult ? (
            <p className="hint">
              Plus proche: <strong>{nearestResult.code}</strong> ({nearestResult.distance_meters} m)
            </p>
          ) : null}

          <ul className="search-list">
            {searchResults.map((r) => (
              <li key={r.vehicle_id}>
                {r.code} - {r.distance_meters} m
              </li>
            ))}
          </ul>
        </div>

        {message ? <p className="notice">{message}</p> : null}
        {error ? <p className="error">{error}</p> : null}
      </aside>

      <section className="content">
        <MapView
          latestPositions={latestPositions}
          historyPoints={historyPoints}
          focusPoint={focusPoint}
        />
      </section>
    </main>
  );
}

export default App;
