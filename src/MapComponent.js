import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const getSeverityColor = (severity) => {
  if (severity === "High") return "#e74c3c";
  if (severity === "Medium") return "#f39c12";
  return "#27ae60";
};

const createColorMarker = (severity) => {
  const color = getSeverityColor(severity);
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 22px; height: 22px;
      border-radius: 50% 50% 50% 0;
      background: ${color};
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -24]
  });
};

const createUserMarker = () =>
  L.divIcon({
    className: "",
    html: `<div style="
      width: 18px; height: 18px;
      border-radius: 50%;
      background: #3498db;
      border: 3px solid white;
      box-shadow: 0 0 0 3px rgba(52,152,219,0.4);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });

const createClickedMarker = () =>
  L.divIcon({
    className: "",
    html: `<div style="
      width: 22px; height: 22px;
      border-radius: 50%;
      background: #9b59b6;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
}

function FlyToMarker({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 16, { duration: 1.2 });
    }
  }, [target, map]);
  return null;
}

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14);
    }
  }, [center, map]);
  return null;
}

export default function MapComponent({
  reports,
  onMapClick,
  clickedLocation,
  flyTarget,
  onClaim,
  userLocation,
  mapCenter
}) {
  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onMapClick={onMapClick} />
      <FlyToMarker target={flyTarget} />
      <RecenterMap center={mapCenter} />

      {/* User's current location — blue dot */}
      {userLocation && (
        <>
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserMarker()}
          >
            <Popup>
              <div style={{ fontFamily: "sans-serif", fontSize: 13 }}>
                <strong>📍 Your Location</strong>
                <br />
                {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
              </div>
            </Popup>
          </Marker>
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={200}
            pathOptions={{ color: "#3498db", fillColor: "#3498db", fillOpacity: 0.08, weight: 1 }}
          />
        </>
      )}

      {/* Pending click location */}
      {clickedLocation && (
        <Marker
          position={[clickedLocation.lat, clickedLocation.lng]}
          icon={createClickedMarker()}
        />
      )}

      {/* All waste reports */}
      {reports.map((report) => (
        <Marker
          key={report.id}
          position={[report.lat, report.lng]}
          icon={createColorMarker(report.severity)}
        >
          <Popup>
            <div style={{ minWidth: 210, fontFamily: "sans-serif" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{
                  background: getSeverityColor(report.severity),
                  color: "white", padding: "2px 8px",
                  borderRadius: 12, fontSize: 11, fontWeight: 700
                }}>{report.severity}</span>
                <span style={{
                  background: report.status === "Cleaned" ? "#27ae60" : report.status === "In Progress" ? "#f39c12" : "#95a5a6",
                  color: "white", padding: "2px 8px",
                  borderRadius: 12, fontSize: 11, fontWeight: 700
                }}>{report.status}</span>
              </div>

              <p style={{ fontWeight: 700, margin: "0 0 4px", fontSize: 14 }}>{report.title}</p>

              {report.address && (
                <p style={{ color: "#666", fontSize: 12, margin: "0 0 6px" }}>📍 {report.address}</p>
              )}

              {report.image && (
                <img
                  src={report.image}
                  alt="waste"
                  style={{ width: "100%", borderRadius: 6, marginBottom: 8, maxHeight: 130, objectFit: "cover" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}

              <p style={{ color: "#aaa", fontSize: 11, margin: "0 0 10px" }}>
                {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
              </p>

              {report.status !== "Cleaned" && (
                <button
                  onClick={() => onClaim(report.id, report.status)}
                  style={{
                    width: "100%", padding: "8px",
                    background: report.status === "In Progress" ? "#27ae60" : "#e74c3c",
                    color: "white", border: "none", borderRadius: 6,
                    cursor: "pointer", fontWeight: 700, fontSize: 13
                  }}
                >
                  {report.status === "In Progress" ? "✅ Mark as Cleaned" : "🙋 Claim for Cleanup"}
                </button>
              )}
              {report.status === "Cleaned" && (
                <p style={{ color: "#27ae60", fontWeight: 700, textAlign: "center", margin: 0 }}>
                  ✅ Area Cleaned
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
