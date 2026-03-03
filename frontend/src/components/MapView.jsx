import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapView({ latestPositions, historyPoints, focusPoint }) {
  const center = focusPoint || [5.348, -4.007];
  const polylinePositions = historyPoints.map((p) => [Number(p.latitude), Number(p.longitude)]);

  return (
    <div className="card map-card">
      <h3>Carte temps reel</h3>
      <MapContainer center={center} zoom={12} className="map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {latestPositions.map((p) => (
          <Marker key={p.vehicle_id} position={[Number(p.latitude), Number(p.longitude)]} icon={icon}>
            <Popup>
              <strong>{p.code}</strong>
              <br />
              {p.label}
              <br />
              Maj: {new Date(p.recorded_at).toLocaleString()}
            </Popup>
          </Marker>
        ))}
        {polylinePositions.length > 1 ? <Polyline positions={polylinePositions} color="red" /> : null}
      </MapContainer>
    </div>
  );
}
